import { ApiProperty } from '@nestjs/swagger';
import { MahjongSubcategory } from '../constants/mahjong.constant';

export class PlayerRecordDto {
  @ApiProperty()
  playerName: string;

  @ApiProperty()
  score: number;
}

export class YakumanRecordDto {
  // 역만 종류
  @ApiProperty()
  yakuman: string[];
  // 화료자
  @ApiProperty()
  winner: string;
  // 방총자 (쯔모 시엔 null)
  @ApiProperty()
  opponent: string | null;
  // 동 n국 m본장 (모르면 null)
  @ApiProperty()
  round: string | null;
}

export class CreateMahjongGameDto {
  @ApiProperty()
  subcategory: MahjongSubcategory;

  @ApiProperty({ type: [PlayerRecordDto] })
  players: PlayerRecordDto[];

  @ApiProperty({ type: [YakumanRecordDto] })
  yakumans: YakumanRecordDto[];

  @ApiProperty()
  note?: string;
}
