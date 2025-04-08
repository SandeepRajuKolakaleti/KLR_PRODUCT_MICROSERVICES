import { Test, TestingModule } from '@nestjs/testing';
import { ChildCategoriesController } from './child-categories.controller';

describe('ChildCategoriesController', () => {
  let controller: ChildCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildCategoriesController],
    }).compile();

    controller = module.get<ChildCategoriesController>(ChildCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
