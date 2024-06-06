/* eslint-disable prettier/prettier */
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  // asymc updateUser

  // async deleteUser
}
