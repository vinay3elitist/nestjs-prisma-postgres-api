/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';

/**
 * Implements a custom guard for NestJS applications that checks if a resource belongs to the authenticated user.
 * The IsMineGuard class implements the CanActivate interface and checks if a post or user profile belongs to the authenticated user.
 */
@Injectable()
export class IsMineGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // It extracts the route and parameter ID from the request
    // Get instance of the route by splitting the path, e.g. /posts/1
    const route = request.route.path.split('/')[1];
    const paramId = isNaN(parseInt(request.params.id))
      ? 0
      : parseInt(request.params.id);

    switch (route) {
      // If the route is 'posts', it queries the database to check if the post belongs to the authenticated user.
      case 'posts':
        const post = await this.prismaService.post.findFirst({
          where: {
            id: paramId,
            authorId: request.user.sub,
          },
        });

        return paramId === post?.id;

      // If the route is not 'posts', it checks if the parameter ID matches the authenticated user's ID.

      default:
        // Check if the user manages its own profile
        return paramId === request.user.sub;
    }
  }
}
