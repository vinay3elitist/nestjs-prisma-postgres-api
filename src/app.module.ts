/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersController } from './modules/users/users.controller';

@Module({
  imports: [CoreModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
