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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { ExpressRequestWithUser } from './interfaces/exress-request-with-user.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';

@Controller('users')
export class UsersController {
  // inject user service
  constructor(private readonly userService: UsersService) {}

  /**
   * Registers a new user.
   *
   * @remarks
   * This method is decorated with `@Public` to allow public access.
   * It accepts a `createUserDto` object containing the user's information.
   * The method calls the `registerUser` method of the `UsersService` to create a new user.
   *
   * @param createUserDto - The data transfer object containing the user's information.
   * @returns A promise that resolves to the newly created user.
   *
   * @throws Will throw an error if the user's email is already registered.
   *
   */
  @Public()
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // call the users service method to register the user
    return this.userService.registerUser(createUserDto);
  }

  /**
   * Login a user with the provided credentials.
   *
   * @remarks
   * This method is decorated with `@Public` to allow public access.
   * It accepts a `loginUserDto` object containing the user's email and password.
   * The method calls the `loginUser` method of the `UsersService` to authenticate the user.
   *
   * @param loginUserDto - The data transfer object containing the user's email and password.
   * @returns A promise that resolves to user's access token.
   *
   * @throws Will throw an error if the user not found and if the user's email or password is incorrect.
   *
   */
  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    // call the users service method to login the user
    return this.userService.loginUser(loginUserDto);
  }

  /**
   * Retrieves the user's profile information from the request object.
   *
   * @remarks
   * This method is used to retrieve the user's profile information from the request object.
   * It is decorated with `@Get('profile')` to define the route for this endpoint.
   *
   * @param req - The Express request object containing the user's information.
   * @returns The user's profile information as a `UserPayload` object.
   *
   * @throws Will throw an error if the user's information is not found in the request object and if token not provided.
   *
   */
  @Get('profile')
  profile(@Request() req: ExpressRequestWithUser): UserPayload {
    return req.user;
  }

  /**
   * Updates a user's profile information.
   *
   * @remarks
   * This method is decorated with `@Patch(':id')` to define the route for this endpoint.
   * It also uses `@UseGuards(IsMineGuard)` to ensure that only the owner of the user can update their profile.
   *
   * @param id - The unique identifier of the user to be updated.
   * @param updateUserDto - The data transfer object containing the updated user's information.
   * @returns A promise that resolves to the updated user's profile information.
   *
   * @throws Will throw an error if the user's information is not found or if the user is not the owner of the profile.
   *
   */
  @Patch(':id')
  @UseGuards(IsMineGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // call the users service method to update the user
    return this.userService.updateUser(+id, updateUserDto);
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @remarks
   * This method is decorated with `@Delete(':id')` to define the route for this endpoint.
   * It also uses `@UseGuards(IsMineGuard)` to ensure that only the owner of the user can delete their profile.
   *
   * @param id - The unique identifier of the user to be deleted.
   * @returns A promise that resolves to a success message upon successful deletion.
   *
   * @throws Will throw an error if the user's information is not found or if the user is not the owner of the profile.
   *
   */
  @Delete(':id')
  @UseGuards(IsMineGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    // call the users service method to delete the user
    return this.userService.deleteUser(+id);
  }
}
