import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { UserState } from "@modules/auth/state/authentication.reducer";
import { selectRoles } from "@modules/auth/state/authentication.selectors";
import { Store } from "@ngrx/store";
import { map, Observable, Subject, takeUntil } from "rxjs";


export const HasRoleGuard: CanActivateFn = (_routeActive: ActivatedRouteSnapshot) => {

    //#region [---- DEPENDENCIES ----]
    const router: Router = inject(Router);
    const store:Store<UserState> = inject(Store<UserState>)
    //#endregion

    const expectedRoles = _routeActive.data["allowedRoles"];

    const unsubscribe$ = new Subject<void>();

    const subscription = store.select(selectRoles).pipe(
      takeUntil(unsubscribe$),
      map(roles => {
        const hasRole = roles.some(role => expectedRoles?.includes(role));
        return !hasRole ? router.navigate(['/home']) : hasRole;
      })
    ).subscribe();

    return new Observable(observer => {
      observer.next(true);
      return () => {
        unsubscribe$.next();
        subscription.unsubscribe();
      };
    });

}

