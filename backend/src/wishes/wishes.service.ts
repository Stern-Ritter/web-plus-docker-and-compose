import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wish = { ...createWishDto, raised: 0, copied: 0, owner };
    return this.wishRepository.save(wish);
  }

  async findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
    });
  }

  async findOneWithFilters(filters: Record<string, any>) {
    return this.wishRepository.findOne({ where: filters });
  }

  async findManyWithFilters(filters: Record<string, any>) {
    return this.wishRepository.find({ where: filters });
  }

  async findLastWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTopWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto) {
    await this.wishRepository.update({ id }, updateWishDto);
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: {
            wishes: true,
            offers: true,
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
    });
  }

  async removeOne(id: number) {
    await this.wishRepository.delete({ id });
  }
}
