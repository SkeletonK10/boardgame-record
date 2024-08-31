import { Controller } from '@nestjs/common';
import { MahjongService } from './mahjong.service';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  // TODO: POST /
  // Needs 'Mahjong Record Admin' Role
  // Body: {east: {nickname, score}, south, west, north} (possibly Array)

  // TODO: GET /
  // Returns briefly

  // TODO: GET /:id

  // TODO: PATCH /:id
  // Needs 'Mahjong Record Admin' Role
  // Body: {east: {nickname, score}, south, west, north}
  // 우마는 cascade 필요 없으므로 그냥 계산하면 됨

  // TODO: DELETE /:id
  // PATCH와 같음
}
