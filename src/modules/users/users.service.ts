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

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // async registerUser
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

  // async loginUser
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
        throw new NotFoundException('Not Found User!');
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

  // asymc updateUser

  // async deleteUser
}
