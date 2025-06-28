import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AuthenticatedGuard } from '../authenticated.guard';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideMockStore(),
      ]
    });
    guard = TestBed.inject(AuthenticatedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
