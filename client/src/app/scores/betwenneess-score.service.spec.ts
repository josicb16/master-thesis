import { TestBed } from '@angular/core/testing';

import { BetwenneessScoreService } from './betwenneess-score.service';

describe('BetwenneessScoreService', () => {
  let service: BetwenneessScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetwenneessScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
