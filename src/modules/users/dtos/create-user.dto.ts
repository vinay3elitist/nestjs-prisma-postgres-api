/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

// create user dto
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}
