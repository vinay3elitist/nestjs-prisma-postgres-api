/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { Post } from '@prisma/client';
import ErrorHandler from 'src/helper/errorHandler';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new post in the database.
   *
   * @param createPostDto - The data required to create a new post.
   * @returns A promise that resolves to the newly created post.
   * @throws ConflictException - If the email of the author is already registered.
   * @throws NotFoundException - If the author of the post is not found.
   * @throws HttpException - If any other error occurs during the creation process.
   */
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = await this.prisma.post.create({
        data: {
          ...createPostDto,
        },
      });

      return newPost;
    } catch (error) {
      ErrorHandler.handle(error, 'Post');
    }
  }

  /**
   * Retrieves all posts from the database.
   *
   * @returns A promise that resolves to an array of all posts.
   * @throws HttpException - If any error occurs during the retrieval process.
   */
  async getAllPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  /**
   * Retrieves a post from the database by its unique identifier.
   *
   * @param id - The unique identifier of the post to retrieve.
   * @returns A promise that resolves to the post with the specified id.
   * @throws NotFoundException - If a post with the specified id is not found.
   * @throws HttpException - If any other error occurs during the retrieval process.
   */
  async getPostById(id: number): Promise<Post> {
    try {
      // find post by id, if not found throw error
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id },
      });

      return post;
    } catch (error) {
      ErrorHandler.handle(error, 'Post', id);
    }
  }

  /**
   * Updates a post in the database by its unique identifier.
   *
   * @param id - The unique identifier of the post to update.
   * @param updatePostDto - The data required to update the post.
   * @returns A promise that resolves to the updated post.
   * @throws NotFoundException - If a post with the specified id is not found.
   * @throws ConflictException - If the email of the author is already registered.
   * @throws HttpException - If any other error occurs during the update process.
   */
  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      // find post by id, if not found throw error
      await this.prisma.post.findUniqueOrThrow({
        where: { id },
      });

      // update post using prisma client
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          ...updatePostDto,
        },
      });

      return updatedPost;
    } catch (error) {
      ErrorHandler.handle(error, 'Post', id);
    }
  }

  /**
   * Deletes a post from the database by its unique identifier.
   *
   * @param id - The unique identifier of the post to delete.
   * @returns A promise that resolves to a success message.
   * @throws NotFoundException - If a post with the specified id is not found.
   * @throws HttpException - If any other error occurs during the deletion process.
   */
  async deletePost(id: number): Promise<string> {
    try {
      // find post by id, if not found throw error
      await this.prisma.post.findUniqueOrThrow({
        where: { id },
      });

      // delete post using prisma client
      await this.prisma.post.delete({
        where: { id },
      });

      return `Post with id ${id} deleted successfully`;
    } catch (error) {
      ErrorHandler.handle(error, 'Post', id);
    }
  }
}
