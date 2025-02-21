import { Module } from '@nestjs/common';
import { MahjongPlayerService } from './player.service';
import { MahjongPlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MahjongPlayer } from './entities/player.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MahjongPlayerRecord } from '../entities/player.record.entity';
import { MahjongService } from '../mahjong.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MahjongPlayer, MahjongPlayerRecord]),
    UserModule,
  ],
  exports: [MahjongPlayerService],
  controllers: [MahjongPlayerController],
  providers: [MahjongService, MahjongPlayerService, UserService],
})
export class MahjongPlayerModule {}
