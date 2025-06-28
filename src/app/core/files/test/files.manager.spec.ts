import { TestBed } from '@angular/core/testing';

import { FilesManager } from '../files.manager';

describe('FilesManager', () => {
  let service: FilesManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
