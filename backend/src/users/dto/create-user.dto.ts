import {
  Length,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;
}
