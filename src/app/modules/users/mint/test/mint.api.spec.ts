import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MintApi } from '../mint.api';

describe('MintApi', () => {
  let service: MintApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(MintApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
