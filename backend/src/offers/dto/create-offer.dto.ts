import { IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  itemId: number;
}
