/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Provides a service for interacting with the Prisma ORM client.
 * It extends the PrismaClient class and implements the OnModuleInit and OnModuleDestroy interfaces.
 * The PrismaService class automatically connects to the database when the module is initialized
 * and disconnects from the database when the module is destroyed.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Initializes the Prisma client and connects to the database.
  async onModuleInit() {
    await this.$connect();
  }
  // Disconnects from the database when the module is destroyed.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
