import { IsOptional, Length, IsString, IsUrl, IsArray } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description: string;

  @IsOptional()
  @IsArray()
  itemsId: number[];
}
