import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class MahjongSeasonOptionDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  season?: number;

  @ApiProperty()
  @IsBoolean()
  isStart: boolean;

  @ApiProperty()
  @IsDateString()
  startDate: string = new Date(1970).toISOString();

  @ApiProperty()
  @IsDateString()
  endDate: string = new Date().toISOString();
}
