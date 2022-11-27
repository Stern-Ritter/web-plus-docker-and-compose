import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Length,
  IsString,
  IsInt,
  IsUrl,
  IsNotEmpty,
  Min,
} from 'class-validator';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @Min(1)
  price: number;

  @Column()
  @Min(0)
  raised: number;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
