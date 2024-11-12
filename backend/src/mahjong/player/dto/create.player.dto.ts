import { ApiProperty } from '@nestjs/swagger';

export class CreateMahjongPlayerDto {
  @ApiProperty()
  playerName: string;

  @ApiProperty()
  nickname: string;
}
