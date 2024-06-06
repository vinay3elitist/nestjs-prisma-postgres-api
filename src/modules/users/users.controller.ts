/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto): string {
    console.log(createUserDto);
    return 'User registered';
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): string {
    console.log(loginUserDto);
    return 'User logged in successfully';
  }

  @Get('profile')
  profile(): string {
    return 'User profile';
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): string {
    console.log(updateUserDto);
    return `Updated User ${id}`;
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): string {
    return `Deleted User ${id}`;
  }
}
