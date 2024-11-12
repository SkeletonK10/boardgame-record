import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty()
  refresh: string;
}
