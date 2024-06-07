/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

// create post dto
export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  isPublished: boolean = false;

  authorId: number;
}
