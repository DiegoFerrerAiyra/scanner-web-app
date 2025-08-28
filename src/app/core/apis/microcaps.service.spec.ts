import { TestBed } from '@angular/core/testing';

import { MicrocapsService } from './microcaps.service';

describe('MicrocapsService', () => {
  let service: MicrocapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrocapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
