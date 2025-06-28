import { TestBed } from '@angular/core/testing';
import { UserAllowedFeaturesFlagGuard } from '../guards/features-flag.guard';

xdescribe('UserAllowedFeaturesFlagGuard', () => {
  let guard: UserAllowedFeaturesFlagGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserAllowedFeaturesFlagGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
