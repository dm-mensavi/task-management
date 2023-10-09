import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<string> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(@Body() authCredentials: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authCredentials);
  }
}
