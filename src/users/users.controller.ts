// api/src/users/users.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';

@Controller('users')
// Use the ValidationPipe globally or at the controller level
// You must set transform: true for DTOs to work correctly
@UsePipes(new ValidationPipe({ transform: true })) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED) // Requirement: Proper HTTP status code (201 Created)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}