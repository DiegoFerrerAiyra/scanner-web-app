import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { PublicGuard } from '../public.guard';

describe('PublicGuard', () => {
  let guard: PublicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    guard = TestBed.inject(PublicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
