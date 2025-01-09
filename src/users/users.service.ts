import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from 'src/auth/dto/signup.auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async getUser(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      omit: { password: true },
    });
  }

  async createUser(data: SignUpDto): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
