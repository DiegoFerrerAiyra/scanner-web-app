import { TestBed } from '@angular/core/testing';

import { CsvManager } from '../csv-manager';

describe('CsvManager', () => {
  let service: CsvManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
