import { Injectable } from '@nestjs/common';
import { CreateMahjongDto } from './dto/create-mahjong.dto';
import { UpdateMahjongDto } from './dto/update-mahjong.dto';

@Injectable()
export class MahjongService {
  create(createMahjongDto: CreateMahjongDto) {
    return 'This action adds a new mahjong';
  }

  findAll() {
    return `This action returns all mahjong`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mahjong`;
  }

  update(id: number, updateMahjongDto: UpdateMahjongDto) {
    return `This action updates a #${id} mahjong`;
  }

  remove(id: number) {
    return `This action removes a #${id} mahjong`;
  }
}
