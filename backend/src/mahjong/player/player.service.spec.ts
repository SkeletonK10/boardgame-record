import { Test, TestingModule } from '@nestjs/testing';
import { MahjongPlayerService } from './player.service';

describe('MahjongPlayerService', () => {
  let service: MahjongPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MahjongPlayerService],
    }).compile();

    service = module.get<MahjongPlayerService>(MahjongPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
