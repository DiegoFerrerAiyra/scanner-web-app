import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthApi } from '../auth.api';

describe('AuthApi', () => {
  let service: AuthApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(AuthApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
