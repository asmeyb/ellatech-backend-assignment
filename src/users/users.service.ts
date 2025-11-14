// api/src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Check for existing email to avoid unique constraint violation (optional, but good practice)
    const existingUser = await this.usersRepository.findOne({ 
        where: { email: createUserDto.email } 
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    // 2. Create and save the new user
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }
}