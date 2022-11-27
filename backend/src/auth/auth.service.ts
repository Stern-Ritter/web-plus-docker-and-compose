import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id };
    const secret = this.configService.get('JWT_SECRET_KEY');
    return { access_token: this.jwtService.sign(payload, { secret }) };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneWithFilters(
      { username },
      { id: true, username: true, password: true },
    );

    if (!user) {
      throw new NotFoundException();
    }

    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return null;
    }
    return user;
  }
}
