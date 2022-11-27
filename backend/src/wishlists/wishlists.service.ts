import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
    items: Wish[],
  ) {
    const { name, image, description } = createWishlistDto;
    const wishlist = { name, image, description, owner, items };

    return this.wishlistRepository.save(wishlist);
  }

  async findAll() {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    await this.wishlistRepository.update({ id }, updateWishlistDto);
    return this.wishlistRepository.findOneBy({ id });
  }

  async removeOne(id: number) {
    await this.wishlistRepository.delete({ id });
  }
}
