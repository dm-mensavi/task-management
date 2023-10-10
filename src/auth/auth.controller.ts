import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<string> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid login credentials' })
  @ApiResponse({ status: 404, description: 'User does not exist' })
  signIn(
    @Body() authCredentials: LoginCredentialsDto,
  ): Promise<{ message: string; token: string }> {
    return this.authService.signIn(authCredentials);
  }
}
