import { Test, TestingModule } from '@nestjs/testing';
import { AddToCartController } from './add-to-cart.controller';

describe('AddToCartController', () => {
  let controller: AddToCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddToCartController],
    }).compile();

    controller = module.get<AddToCartController>(AddToCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
