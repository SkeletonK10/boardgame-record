import { ApiProperty } from '@nestjs/swagger';
import {
  MahjongCategory,
  MahjongCategoryValues,
} from '../constants/mahjong.constant';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class MahjongOptionDto {
  @ApiProperty()
  @IsOptional()
  @IsIn(MahjongCategoryValues)
  category?: MahjongCategory;

  @ApiProperty()
  @IsOptional()
  @IsString()
  playerName?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  from?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  to?: number;

  @ApiProperty()
  @IsDateString()
  startDate: string = new Date(1970).toISOString();

  @ApiProperty()
  @IsDateString()
  endDate: string = new Date().toISOString();

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  season?: number;
}
