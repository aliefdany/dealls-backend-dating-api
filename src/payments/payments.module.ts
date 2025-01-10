import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfilesService } from 'src/profiles/profiles.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, ProfilesService],
})
export class PaymentsModule {}
