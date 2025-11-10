import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MenuController } from './menu.controller';

@Module({
  imports: [PrismaModule],
  providers: [MenuService],
  exports: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
