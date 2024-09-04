import { Test, TestingModule } from '@nestjs/testing';
import { MahjongPlayerController } from './player.controller';
import { MahjongPlayerService } from './player.service';

describe('MahjongPlayerController', () => {
  let controller: MahjongPlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MahjongPlayerController],
      providers: [MahjongPlayerService],
    }).compile();

    controller = module.get<MahjongPlayerController>(MahjongPlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
