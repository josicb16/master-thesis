import { TestBed } from '@angular/core/testing';

import { ProteinDegreeService } from './protein-degree.service';

describe('ProteinDegreeService', () => {
  let service: ProteinDegreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProteinDegreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
