import { TestBed } from '@angular/core/testing';

import { RolesService } from '../roles.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RolesService,
        provideMockStore(),
      ]
    });
    service = TestBed.inject(RolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
