/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * @class AuthGuard
 * Implements a custom authentication guard for NestJS applications.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * @param context The execution context of the current request.
   * @returns A Promise that resolves to a boolean indicating whether access is allowed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Checks if the route is public or requires authentication.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, it returns true.
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // extracts the JWT token from the request header.
    const token = this.extractTokenFromHeader(request);

    // If the token is invalid or missing, it throws an UnauthorizedException.
    if (!token) {
      throw new UnauthorizedException();
    }

    // verifies the token, and attaches the user payload to the request object.
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request header.
   * @param request The incoming HTTP request.
   * @returns The extracted JWT token or undefined if the token is missing or invalid.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
