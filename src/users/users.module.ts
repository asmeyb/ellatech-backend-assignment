// api/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity'; // Import the entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity with TypeORM
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}