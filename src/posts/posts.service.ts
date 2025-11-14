import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './custom-dto/post-exists.pipe';

@Injectable()
export class PostsService {
  
constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ){}

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOneBy({ id });
    if(!singlePost) 
    {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    } 
    
    return singlePost;
    
  }

  // The 'create' method correctly omits 'id', 'createdAt', and 'updatedAt'
  async create(createPostData: CreatePostDto): Promise<Post> {
    const newlyCreatedPost = this.postsRepository.create({
      title : createPostData.title,
      content : createPostData.content,
      authorName : createPostData.authorName
    })
      
    return this.postsRepository.save(newlyCreatedPost)
  }  

  async update(id: number, updatePostData: UpdatePostDto): Promise<Post> 
  {
    const findPostToUpdate = await this.findOne(id);

    // Update only the fields that are provided in updatePostData
    if (updatePostData.title) {
      findPostToUpdate.title = updatePostData.title;
    }
    if (updatePostData.content)  {
      findPostToUpdate.content = updatePostData.content;
    }
    if (updatePostData.authorName) {
      findPostToUpdate.authorName = updatePostData.authorName;
    }
    return this.postsRepository.save(findPostToUpdate);
  }   
  

  async remove(id: number): Promise<void> 
  {
    const findPostToDelete = await this.findOne(id)
    
    await this.postsRepository.remove(findPostToDelete);

  }

}