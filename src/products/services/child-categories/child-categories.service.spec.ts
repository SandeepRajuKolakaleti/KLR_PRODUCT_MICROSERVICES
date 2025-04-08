import { Test, TestingModule } from '@nestjs/testing';
import { ChildCategoriesService } from './child-categories.service';

describe('ChildCategoriesService', () => {
  let service: ChildCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildCategoriesService],
    }).compile();

    service = module.get<ChildCategoriesService>(ChildCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
