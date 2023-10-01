import { TestBed } from '@angular/core/testing';

import { AdditionalDataPassingService } from './additional-data-passing.service';

describe('AdditionalDataPassingService', () => {
  let service: AdditionalDataPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalDataPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
