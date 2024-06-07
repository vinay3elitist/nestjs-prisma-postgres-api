/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post as CPost } from '@prisma/client';
import { ExpressRequestWithUser } from '../users/interfaces/exress-request-with-user.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Create a new post.
   *
   * @param createPostDto - The data transfer object for creating a new post.
   * @param req - The Express request object containing the user's information.
   * @returns A promise that resolves to the newly created post.
   *
   * @remarks
   * This method sets the authorId of the post to the current user's id before creating it.
   *
   * @throws Will throw an error if the post creation fails.
   */
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: ExpressRequestWithUser,
  ): Promise<CPost> {
    // set authorId to current user's id
    createPostDto.authorId = req.user.sub;
    return this.postsService.createPost(createPostDto);
  }

  /**
   * Retrieves all posts from the database.
   *
   * @returns A promise that resolves to an array of all posts.
   *
   * @remarks
   * This method is decorated with `@Public` to allow access to all users.
   *
   * @throws Will throw an error if the retrieval of posts fails.
   */
  @Public()
  @Get()
  getAllPosts(): Promise<CPost[]> {
    return this.postsService.getAllPosts();
  }

  @Public()
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<CPost> {
    return this.postsService.getPostById(id);
  }

  /**
   * Retrieves a post by its ID from the database.
   *
   * @param id - The unique identifier of the post to retrieve.
   * @returns A promise that resolves to the requested post.
   *
   * @remarks
   * This method is decorated with `@Public` to allow access to all users.
   * It uses the `ParseIntPipe` to convert the `id` parameter from string to number.
   *
   * @throws Will throw an error if the retrieval of the post fails.
   * @throws Will throw an error if the `id` parameter is not a valid number.
   */
  @Patch(':id')
  @UseGuards(IsMineGuard) // Prevent user from deleting other user's posts
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<CPost> {
    return this.postsService.updatePost(+id, updatePostDto);
  }

  /**
   * Deletes a post from the database.
   *
   * @param id - The unique identifier of the post to delete.
   * @returns A promise that resolves to a success message.
   *
   * @remarks
   * This method is decorated with `@UseGuards(IsMineGuard)` to ensure that only the author of the post can delete it.
   * It uses the `ParseIntPipe` to convert the `id` parameter from string to number.
   *
   * @throws Will throw an error if the deletion of the post fails.
   * @throws Will throw an error if the `id` parameter is not a valid number.
   */
  @Delete(':id')
  @UseGuards(IsMineGuard) // Prevent user from deleting other user's posts
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.postsService.deletePost(+id);
  }
}
