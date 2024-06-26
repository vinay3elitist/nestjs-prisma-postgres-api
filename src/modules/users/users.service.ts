/* eslint-disable prettier/prettier */
import {
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
import ErrorHandler from 'src/helper/errorHandler';
import { queries } from 'src/raw query/rawQuery';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Functions based on RAW Query
  // get all users raw query based
  async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.prisma.$queryRaw(queries.GET_ALL_USERS);
      users.forEach((user) => {
        delete user.password;
      });
      return users;
    } catch (error) {
      ErrorHandler.handle(error, 'User');
    }
  }

  //register new user raw query based
  async registerUserWithRawQuery(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, name } = createUserDto;
      const hasedPassword = await hash(password, 10);

      await this.prisma.$executeRaw(
        queries.CREATE_USER(email, hasedPassword, name),
      );

      const newUser = await this.prisma.$queryRaw(
        queries.GET_USER_BY_EMAIL(email),
      );
      delete newUser[0].password;

      return newUser[0];
    } catch (error) {
      ErrorHandler.handle(error, 'User');
    }
  }

  // update user raw query based
  async updateUserWithRawQuery(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      // const { email, password, name } = updateUserDto;
      const user = await this.prisma.$queryRaw(queries.GET_USER_BY_ID(id));

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.$executeRaw(queries.UPDATE_USER(id, updateUserDto));

      const newUser = await this.prisma.$queryRaw(queries.GET_USER_BY_ID(id));
      delete newUser[0].password;

      return newUser[0];
    } catch (error) {
      ErrorHandler.handle(error, 'User');
    }
  }

  // ----------------------------------------------------------------
  // Functions based on prisma client
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
      ErrorHandler.handle(error, 'User');
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
      ErrorHandler.handle(error, 'User');
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
      ErrorHandler.handle(error, 'User', id);
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
      ErrorHandler.handle(error, 'User', id);
    }
  }
}
