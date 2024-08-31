import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MahjongService } from './mahjong.service';
import { CreateMahjongDto } from './dto/create-mahjong.dto';
import { UpdateMahjongDto } from './dto/update-mahjong.dto';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  @Post()
  create(@Body() createMahjongDto: CreateMahjongDto) {
    return this.mahjongService.create(createMahjongDto);
  }

  @Get()
  findAll() {
    return this.mahjongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mahjongService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMahjongDto: UpdateMahjongDto) {
    return this.mahjongService.update(+id, updateMahjongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mahjongService.remove(+id);
  }
}
