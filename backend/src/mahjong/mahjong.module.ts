import { Module } from '@nestjs/common';
import { MahjongService } from './mahjong.service';
import { MahjongController } from './mahjong.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MahjongGameRecord } from './entities/game-record.entity';
import { MahjongPlayerModule } from './player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([MahjongGameRecord]), MahjongPlayerModule],
  controllers: [MahjongController],
  providers: [MahjongService],
})
export class MahjongModule {}
