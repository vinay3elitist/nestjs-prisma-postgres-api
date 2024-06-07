/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * Represents a data transfer object (DTO) for updating a post.
 * It extends the PartialType utility from NestJS, which allows partial updates.
 * The UpdatePostDto class inherits properties from the CreatePostDto class.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
