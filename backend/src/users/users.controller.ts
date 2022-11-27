import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface CustomRequest extends Request {
  user: Record<string, any>;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findCurrentUser(@Req() req: CustomRequest) {
    const { username } = req.user;
    const user = await this.usersService.findOneWithFilters({ username });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findUser(@Param('username') username: string) {
    const user = await this.usersService.findOneWithFilters({ username });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async findCurrentUserWishes(@Req() req: CustomRequest) {
    const { username } = req.user;
    return this.usersService.findUserWishes(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(
    @Req() req: CustomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const id = req.user.id;
    const user = await this.usersService.updateOne(id, updateUserDto);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find')
  async findMany(@Body() body: { query: string }) {
    const { query } = body;
    const filters = [{ username: query }, { email: query }];
    return await this.usersService.findManyWithFilters(filters);
  }
}
