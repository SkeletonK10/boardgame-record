import { Module } from '@nestjs/common';
import { MahjongService } from './mahjong.service';
import { MahjongController } from './mahjong.controller';

@Module({
  controllers: [MahjongController],
  providers: [MahjongService],
})
export class MahjongModule {}
