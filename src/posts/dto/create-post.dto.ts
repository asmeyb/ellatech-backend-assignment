import { IsNotEmpty, IsString, Max, MaxLength, min, MinLength } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title should not be empty' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;

  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(5, { message: 'Content must be at least 5 characters long' })
  content: string;

  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(3, { message: 'Author Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Author Name must be at most 50 characters long' })
  authorName: string;
}   