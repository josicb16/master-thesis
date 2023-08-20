import { TestBed } from '@angular/core/testing';

import { ClosenessScoreService } from './closeness-score.service';

describe('ClosenessScoreService', () => {
  let service: ClosenessScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClosenessScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
