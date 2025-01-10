import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Dealls Dating App API 👩🏻‍❤️‍💋‍👨🏻')
    .setDescription(
      `Welcome to the heart of the dating world—the backend API designed to make connections smoother than a well-rehearsed pick-up line. Tailored for a swipe-based dating app like Tinder or Bumble, this robust and scalable system ensures your love life (and app performance) never runs out of steam.

Features That Make Cupid Jealous:\n
1. Secure sign-up and login capabilities that even your grandma could navigate (though let’s hope she won’t have to).\n
2. Enable users to pass (left swipe) or like (right swipe) up to 10 profiles daily. Our smart profile caching ensures no awkward déjà vu moments with profiles popping up twice in a day—because nobody likes ghosts, not even digital ones.\n
3. Premium Perks: Upsell premium packages that remove swipe limits or add a verified badge, making users feel like the dating royalty they are.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
