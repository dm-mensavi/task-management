import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsStrongPassword()
  password: string;
}

export class LoginCredentialsDto {
  username: string;

  password: string;
}
