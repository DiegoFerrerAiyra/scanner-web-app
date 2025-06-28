import { inject, Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map, Observable, tap } from 'rxjs';
import { GlobalState } from 'src/app/core/global-state/app.state';
import { selectToken } from 'src/app/modules/auth/state/authentication.selectors';


@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate, CanMatch {

  private readonly router:Router = inject(Router)
  private store: Store<GlobalState> = inject(Store<GlobalState>)

  canActivate(): Observable<boolean | UrlTree>{
    return this.checkLogged()
  }
  canMatch(): Observable<boolean | UrlTree> {
    return this.checkLogged()
  }

  private checkLogged():Observable<boolean>{
    return this.store.select(selectToken).pipe(
      first(),
      tap(token => {
        if (token) this.router.navigateByUrl('/home');
      }),
      map(token => !token)
    )
  }

}
