import { Test, TestingModule } from '@nestjs/testing';
import { AddToCartService } from './add-to-cart.service';

describe('AddToCartService', () => {
  let service: AddToCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddToCartService],
    }).compile();

    service = module.get<AddToCartService>(AddToCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
