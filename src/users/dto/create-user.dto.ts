// api/src/users/dto/create-user.dto.ts
import { IsNotEmpty, IsString, IsEmail, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string; // class-validator automatically checks for valid email format
}