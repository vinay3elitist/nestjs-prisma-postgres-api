/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    @Post('register')
    registerUser(@Body() createUserDto: CreateUserDto): string {
        console.log(createUserDto);
        return 'User registered';
    }
}
