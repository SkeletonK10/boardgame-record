import { Module } from '@nestjs/common';
import { MahjongPlayerService } from './player.service';
import { MahjongPlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MahjongPlayer } from './entities/player.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([MahjongPlayer]), UserModule],
  exports: [MahjongPlayerService],
  controllers: [MahjongPlayerController],
  providers: [MahjongPlayerService, UserService],
})
export class MahjongPlayerModule {}
