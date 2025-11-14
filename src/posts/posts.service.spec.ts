import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      content: 'This is my first post',
      authorName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const singlePost = this.posts.find((post) => post.id === id);
    if(!singlePost) 
    {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    } 
    
    return singlePost;
    
  }

  // The 'create' method correctly omits 'id', 'createdAt', and 'updatedAt'
  create(createPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1  
      : 1;
  }
}