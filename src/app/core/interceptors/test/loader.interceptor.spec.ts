import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { LoaderInterceptor } from '../loader.interceptor';

describe('LoaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoaderInterceptor,
      provideMockStore()
    ]
  }));

  it('should be created', () => {
    const interceptor: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
