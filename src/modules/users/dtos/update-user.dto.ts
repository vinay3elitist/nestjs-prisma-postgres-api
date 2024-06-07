/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * A class representing a data transfer object (DTO) for updating a user.
 * It extends `PartialType` from `@nestjs/mapped-types` and takes `CreateUserDto` as a parameter.
 * This means that `UpdateUserDto` is a partial representation of `CreateUserDto`,
 * allowing partial updates to user data.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
