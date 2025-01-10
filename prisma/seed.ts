import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const unlimitedQuotaFeature = await prisma.feature.create({
    data: {
      code: 'PR-01',
      description: 'Unlimited views',
    },
  });

  const verifiedBadgeFeature = await prisma.feature.create({
    data: {
      code: 'PR-02',
      description: 'Special badge',
    },
  });

  const regularPackage = await prisma.package.create({
    data: {
      name: 'Regular',
      description: '10-profile limit',
      PackageFeature: {
        create: [],
      },
    },
  });

  const premiumPackage = await prisma.package.create({
    data: {
      name: 'Premium',
      description: 'Premium',
      PackageFeature: {
        create: [
          { feature_id: unlimitedQuotaFeature.id },
          { feature_id: verifiedBadgeFeature.id },
        ],
      },
    },
  });

  for (let i = 1; i <= 15; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        password: `password${i}`,
        Profile: {
          create: {
            full_name: `User ${i}`,
            package_id: i % 2 === 0 ? premiumPackage.id : regularPackage.id, // Alternate between Regular and Premium
            dob: new Date(),
            bio: `This is user ${i}'s bio.`,
          },
        },
      },
    });
    console.log(`Created user: ${user.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
