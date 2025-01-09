import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import { SignupEntity } from './entities/signup.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async signUp(username: string, password: string): Promise<SignupEntity> {
    let user = await this.usersService.getUser(username);

    if (user) {
      throw new ConflictException(
        `User with username ${username} already exist`,
      );
    }

    const hash = await this.hashPassword(password);

    user = await this.usersService.createUser({
      username,
      password: hash,
    });

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = 10;

    return await bcrypt.hash(password, rounds);
  }
}
