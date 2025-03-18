import { ApiProperty } from '@nestjs/swagger';
import {
  MahjongCategory,
  MahjongCategoryValues,
} from '../constants/mahjong.constant';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  @IsDateString()
  startDate?: string = new Date(1970).toISOString();

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: string = new Date().toISOString();

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  season?: number;
}
