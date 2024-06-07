/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

// login user dto
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
