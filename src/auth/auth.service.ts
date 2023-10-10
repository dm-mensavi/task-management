import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from '../auth/dto/auth-credentials.dto';
import { User } from '../users/dto/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<string> {
    try {
      const { username, password } = authCredentials;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        username,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      return `User ${username} added successfully!`;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
    }
  }

  async signIn(
    authCredentials: LoginCredentialsDto,
  ): Promise<{ message: string; token: string }> {
    const { username, password } = authCredentials;

    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return {
        message: `Login Successful! Welcome back Mr./Mrs. ${username}.`,
        token: accessToken,
      };
    } else {
      throw new UnauthorizedException(
        'Please check your login credentials and try again ',
      );
    }
  }
}
