import { inject, Injectable } from '@angular/core';
import { CanActivate, CanMatch} from '@angular/router';
import { FeatureFlagService } from '@modules/web/feature-flags/feature-flag.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAllowedFeaturesFlagGuard implements CanActivate, CanMatch {

  private readonly featuresFlagService:FeatureFlagService = inject(FeatureFlagService)

  canActivate(): Observable<boolean> {
    return this.isEnabled()
  }

  canMatch(): Observable<boolean> {
    return this.isEnabled()
  }

  isEnabled():Observable<boolean>{

    return this.featuresFlagService.userAllowedForFeatureFlags()

  }
}
