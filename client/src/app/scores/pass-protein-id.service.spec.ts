import { TestBed } from '@angular/core/testing';

import { PassProteinIDService } from './pass-protein-id.service';

describe('PassProteinIDService', () => {
  let service: PassProteinIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassProteinIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
