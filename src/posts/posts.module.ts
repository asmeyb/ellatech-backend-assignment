import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostExistsPipe } from './custom-dto/post-exists.pipe';


@Module({
  imports: [
    //this will register the Post entity with TypeORM in this module
    TypeOrmModule.forFeature([Post])
  ],
  controllers: [PostsController],
  providers: [PostsService, PostExistsPipe],
  exports: [PostsService],
})
export class PostsModule {}

