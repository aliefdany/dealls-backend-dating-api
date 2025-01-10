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
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string): Promise<AuthEntity> {
    const profile = await this.prisma.profile.findFirst({
      where: { user: { username } },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      profile.user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      username,
      accessToken: this.jwtService.sign({
        userId: profile.user.id,
        profileId: profile.id,
      }),
    };
  }

  async signUp(username: string, password: string): Promise<UserEntity> {
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

    const subs = await this.prisma.package.findFirst({
      where: { name: 'Regular' },
    });

    await this.prisma.profile.create({
      data: {
        user_id: user.id,
        full_name: user.username,
        package_id: subs.id,
        dob: new Date(),
        bio: 'test',
      },
    });

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = 10;

    return await bcrypt.hash(password, rounds);
  }
}
