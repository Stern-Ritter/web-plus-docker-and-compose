import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { EmailSender } from '../email-sender/email-sender.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface CustomRequest extends Request {
  user: Record<string, any>;
}

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
    private readonly emailSender: EmailSender,
  ) {}

  @Post()
  async create(
    @Req() req: CustomRequest,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.price === wish.raised) {
      throw new BadRequestException(
        'Нельзя скинуться на подаркок, на который уже собраны деньги.',
      );
    }

    if (amount + wish.raised > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка.',
      );
    }

    const { owner } = wish;
    const { user } = req;

    if (owner.id == user.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки.',
      );
    }

    const currentUser = await this.usersService.findOne(user.id);

    if (amount + wish.raised === wish.price) {
      const currentOfferMails = wish.offers.map((offer) => offer.user.email);
      const mails = [...currentOfferMails, currentUser.email];
      await this.emailSender.sendEmail(
        mails,
        `Собраны деньги на ${wish.name} для ${wish.owner.username}.`,
      );
    }

    const { id, raised } = wish;
    const increasedRaised = raised + amount;
    const updatedWish = await this.wishesService.updateOne(id, {
      raised: increasedRaised,
    });

    return this.offersService.create(createOfferDto, currentUser, updatedWish);
  }

  @Get()
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = this.offersService.findOne(Number(id));

    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }
}
