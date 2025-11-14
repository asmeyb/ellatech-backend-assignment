// posts.controller.ts

import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  ParseIntPipe,
  Query,
  NotFoundException,
  HttpStatus,
  HttpCode,  
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
// FIX: Changed to 'import type' to resolve the 'isolatedModules' error
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './custom-dto/post-exists.pipe';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<PostEntity> {
    
    return this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async create(
    @Body()
    createPostData: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<void> {
     await this.postsService.remove(id);
  }
}
