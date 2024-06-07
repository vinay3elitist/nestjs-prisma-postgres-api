/* eslint-disable prettier/prettier */
import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

class ErrorHandler {
  static handle(error: any, entityType: string, id?: string | number): void {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Email already registered');
      case 'P2003':
        throw new NotFoundException('Author not found');
      case 'P2025':
        throw new NotFoundException(`${entityType} with id ${id} not found`);
      default:
        throw new HttpException(error, 500);
    }
  }
}

export default ErrorHandler;
