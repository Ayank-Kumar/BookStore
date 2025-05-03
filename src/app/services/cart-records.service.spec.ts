import { TestBed } from '@angular/core/testing';

import { CartRecordsService } from './cart-records.service';

describe('CartRecordsService', () => {
  let service: CartRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
