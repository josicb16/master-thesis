import { TestBed } from '@angular/core/testing';

import { PagerankServiceService } from './pagerank-service.service';

describe('PagerankServiceService', () => {
  let service: PagerankServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagerankServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
