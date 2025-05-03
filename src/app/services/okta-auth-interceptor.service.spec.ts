import { TestBed } from '@angular/core/testing';

import { OktaAuthInterceptorService } from './okta-auth-interceptor.service';

describe('OktaAuthInterceptorService', () => {
  let service: OktaAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OktaAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
