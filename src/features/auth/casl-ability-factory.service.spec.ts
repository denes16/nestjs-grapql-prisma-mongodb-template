import { Test, TestingModule } from '@nestjs/testing';
import { CaslAbilityFactoryService } from './casl-ability-factory.service';

describe('CaslAbilityFactoryService', () => {
  let service: CaslAbilityFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactoryService],
    }).compile();

    service = module.get<CaslAbilityFactoryService>(CaslAbilityFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
