import { inject, Injectable } from '@angular/core';
import { Roles } from '@core/roles/models/types/roles.types';
import { UserState } from '@modules/auth/state/authentication.reducer';
import { selectRoles } from '@modules/auth/state/authentication.selectors';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';

@Injectable()
export class RolesService {

  //#region [---- DEPENDENCIES ----]

  private store:Store<UserState> = inject(Store<UserState>)

  //#endregion

  /**
   * Validates if the user has any of the available roles.
   * Doesn't need unsubscribe, inside it's implemented with "first" operator
   * @param {Roles[]} roles - The roles to check against the user's roles.
   * @returns {Observable<boolean>} - An observable that emits true if the user has any of the specified roles, false otherwise.
   */
  public validateIfHasAvailableRole(roles:Roles[]):Observable<boolean> {
    return this.store.select(selectRoles).pipe(
      first(),
      map(userRoles => {
        return  roles.some(role => userRoles.includes(role));
      })
    )
  }


}
