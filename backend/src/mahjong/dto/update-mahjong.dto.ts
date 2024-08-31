import { PartialType } from '@nestjs/mapped-types';
import { CreateMahjongDto } from './create-mahjong.dto';

export class UpdateMahjongDto extends PartialType(CreateMahjongDto) {}
