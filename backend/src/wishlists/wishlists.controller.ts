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
import { In } from 'typeorm';
import { WishlistsService } from './wishlists.service';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface CustomRequest extends Request {
  user: Record<string, any>;
}

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: CustomRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const { user } = req;
    const currentUser = await this.usersService.findOne(user.id);

    const { itemsId } = createWishlistDto;
    const filters = { id: In(itemsId) };
    const wishes = await this.wishesService.findManyWithFilters(filters);

    return this.wishlistsService.create(createWishlistDto, currentUser, wishes);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException();
    }
    return wishlist;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException();
    }

    const { user } = req;

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.wishlistsService.updateOne(Number(id), updateWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException();
    }

    const { user } = req;

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.wishlistsService.removeOne(Number(id));
    return wishlist;
  }
}
