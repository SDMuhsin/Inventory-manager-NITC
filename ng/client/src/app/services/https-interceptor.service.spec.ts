import { TestBed } from '@angular/core/testing';

import { HttpsInterceptorService } from './https-interceptor.service';

describe('HttpsInterceptorService', () => {
  let service: HttpsInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpsInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
