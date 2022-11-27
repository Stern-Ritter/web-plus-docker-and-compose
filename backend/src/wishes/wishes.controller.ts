import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface CustomRequest extends Request {
  user: Record<string, any>;
}

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('last')
  async findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  async findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = this.wishesService.findOne(Number(id));
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: CustomRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    const { user } = req;
    const currentUser = await this.usersService.findOne(user.id);
    return this.wishesService.create(createWishDto, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async createCopy(@Req() req: CustomRequest, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(Number(id));

    if (!wish) {
      throw new NotFoundException();
    }

    const increaseadCopiedValue = wish.copied + 1;
    await this.wishesService.updateOne(Number(id), {
      copied: increaseadCopiedValue,
    });

    const { user } = req;
    const currentUser = await this.usersService.findOne(user.id);
    const { name, link, image, price, description } = wish;
    return this.wishesService.create(
      { name, link, image, price, description },
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne(Number(id));

    if (!wish) {
      throw new NotFoundException();
    }

    const { user } = req;

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    if (wish.offers.length) {
      const oldPrice = wish.price;

      await this.wishesService.updateOne(Number(id), {
        ...updateWishDto,
        price: oldPrice,
      });
    } else {
      await this.wishesService.updateOne(Number(id), updateWishDto);
    }

    return this.wishesService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(Number(id));

    if (!wish) {
      throw new NotFoundException();
    }

    const { user } = req;

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.wishesService.removeOne(Number(id));
    return wish;
  }
}
