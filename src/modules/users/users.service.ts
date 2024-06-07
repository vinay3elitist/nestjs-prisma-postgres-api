/* eslint-disable prettier/prettier */
import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { compare, hash } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the system.
   *
   * @param createUserDto - The data required to create a new user.
   * @returns A promise that resolves to the newly created user object, without the password.
   * @throws ConflictException - If the email provided is already registered.
   * @throws HttpException - If any other error occurs during the registration process.
   */
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // create new user using prisma client
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10), // hash user's password
          name: createUserDto.name,
        },
      });

      // delete password from new user object
      delete newUser.password;

      return newUser;
    } catch (error) {
      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw new HttpException(error, 500);
    }
  }

  /**
   * Authenticates a user and returns a JWT access token.
   *
   * @param loginUserDto - The data required to authenticate the user.
   * @returns A promise that resolves to a LoginResponse object containing the access token.
   * @throws NotFoundException - If the user with the provided email is not found.
   * @throws UnauthorizedException - If the provided password does not match the user's password.
   * @throws HttpException - If any other error occurs during the login process.
   */
  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      // find user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginUserDto.email,
        },
      });

      // check if user exists
      if (!user) {
        throw new NotFoundException('User Not Found!');
      }

      // check if password is correct by comparing it with hashed password
      if (!(await compare(loginUserDto.password, user.password))) {
        throw new UnauthorizedException('Invalid Credentials!');
      }

      // payload
      const payload: UserPayload = {
        sub: user.id, // sub is the user id
        email: user.email,
        name: user.name,
      };

      return {
        // return access token
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      // throw error if any
      throw new HttpException(error, 500);
    }
  }

  /**
   * Updates a user in the system.
   *
   * @param id - The unique identifier of the user to be updated.
   * @param updateUserDto - The data required to update the user.
   * @returns A promise that resolves to the updated user object, without the password.
   * @throws NotFoundException - If the user with the provided id is not found.
   * @throws ConflictException - If the email provided is already registered for another user.
   * @throws HttpException - If any other error occurs during the update process.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // find user by id, if not found throw error
      await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      // update user using prisma client
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          // if password is provided, then hash it
          ...(updateUserDto.password && {
            password: await hash(updateUserDto.password, 10),
          }),
        },
      });

      // delete password from updated user object
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      // check if user not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw new HttpException(error, 500);
    }
  }

  /**
   * Deletes a user from the system.
   *
   * @param id - The unique identifier of the user to be deleted.
   * @returns A promise that resolves to a string message indicating the successful deletion.
   * @throws NotFoundException - If the user with the provided id is not found.
   * @throws HttpException - If any other error occurs during the deletion process.
   */
  async deleteUser(id: number): Promise<string> {
    try {
      // find user by id, if not found throw error
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      // delete user using prisma client
      await this.prisma.user.delete({
        where: { id },
      });

      return `User with id ${user.id} deleted`;
    } catch (error) {
      // check if user not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // throw error if any
      throw new HttpException(error, 500);
    }
  }
}
