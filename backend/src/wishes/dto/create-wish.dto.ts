import { Length, IsString, IsUrl, IsNotEmpty, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  raised?: number;

  copied?: number;
}
