import { Module } from '@nestjs/common';
import { MahjongService } from './mahjong.service';
import { MahjongController } from './mahjong.controller';
import { MahjongPlayerModule } from './player/player.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MahjongPlayerModule, UserModule],
  controllers: [MahjongController],
  providers: [MahjongService],
})
export class MahjongModule {}
