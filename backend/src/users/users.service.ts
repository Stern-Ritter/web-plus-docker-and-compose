import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...res } = createUserDto;
    const hashedPassword = await hash(
      password,
      +this.configService.get('SALT_OR_ROUNDS'),
    );
    return this.userRepository.save({ ...res, password: hashedPassword });
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findOneWithFilters(filters: Record<string, any>, fields?: any) {
    return this.userRepository.findOne({ where: filters, select: fields });
  }

  async findManyWithFilters(filters: Record<string, any>) {
    return this.userRepository.find({ where: filters });
  }

  async findUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: {
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
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const { wishes } = user;
    return wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...res } = updateUserDto;
    if (password) {
      const hashedPassword = await hash(
        password,
        +this.configService.get('SALT_OR_ROUNDS'),
      );
      const updateUserDtoWithHashedPassword = {
        ...res,
        password: hashedPassword,
      };
      await this.userRepository.update({ id }, updateUserDtoWithHashedPassword);
    } else {
      await this.userRepository.update({ id }, updateUserDto);
    }

    return this.userRepository.findOneBy({ id });
  }

  async removeOne(id: number) {
    await this.userRepository.delete({ id });
  }
}
