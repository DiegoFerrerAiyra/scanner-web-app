import { TestBed } from '@angular/core/testing';

import { FilesApi } from '../files.api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FilesApi', () => {
  let service: FilesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(FilesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
