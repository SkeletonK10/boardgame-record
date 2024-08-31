import { Test, TestingModule } from '@nestjs/testing';
import { MahjongService } from './mahjong.service';

describe('MahjongService', () => {
  let service: MahjongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MahjongService],
    }).compile();

    service = module.get<MahjongService>(MahjongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
