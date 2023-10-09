import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from '../users/dto/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      console.log(error.code);
    }
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentials;

    const user = await this.userRepository.findOneBy({ username });

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      return 'Login Successful! \nWelcome back';
    } else {
      throw new UnauthorizedException(
        'Please check your login credentials and try again ',
      );
    }
  }
}
