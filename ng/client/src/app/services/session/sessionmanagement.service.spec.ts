import { TestBed } from '@angular/core/testing';

import { SessionmanagementService } from './sessionmanagement.service';

describe('SessionmanagementService', () => {
  let service: SessionmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
