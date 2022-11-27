import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User, item: Wish) {
    const { amount, hidden } = createOfferDto;
    const offer = { amount, hidden, user, item };
    return this.offerRepository.save(offer);
  }

  async findAll() {
    return this.offerRepository.find({
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: true,
          offers: true,
          wishlists: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.offerRepository.find({
      where: { id },
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
          },
          offers: true,
          wishlists: {
            owner: true,
            items: true,
          },
        },
      },
    });
  }
}
