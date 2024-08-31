import { Test, TestingModule } from '@nestjs/testing';
import { MahjongController } from './mahjong.controller';
import { MahjongService } from './mahjong.service';

describe('MahjongController', () => {
  let controller: MahjongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MahjongController],
      providers: [MahjongService],
    }).compile();

    controller = module.get<MahjongController>(MahjongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
