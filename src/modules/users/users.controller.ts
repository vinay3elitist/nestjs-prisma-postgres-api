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
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { LoginResponse } from './interfaces/users-login.interface';

@Controller('users')
export class UsersController {
  // inject user service
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // call the users service method to register the user
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    // call the users service method to login the user
    return this.userService.loginUser(loginUserDto);
  }

  @Get('profile')
  profile(): string {
    return 'User profile';
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // call the users service method to update the user
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    // call the users service method to delete the user
    return this.userService.deleteUser(+id);
  }
}
