import { TestBed } from '@angular/core/testing';

import { WafProtectionService } from '../waf-protection.service';

describe('WafProtectionService', () => {
  let service: WafProtectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WafProtectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
