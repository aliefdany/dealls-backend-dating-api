import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync('npx prisma migrate reset --force --skip-seed');
  execSync('npx ts-node prisma/seed.ts');
});

afterAll(async () => {
  await prisma.$disconnect();
});
