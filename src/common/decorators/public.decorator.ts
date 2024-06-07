/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

/**
 * Exports a decorator function called `Public` that sets a metadata key `isPublic` to `true`.
 * This decorator can be used to mark properties or methods as public or accessible.
 * The metadata key and value can be used in custom logic or middleware to control access to the marked properties or methods.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
