import { inject, Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import {  first, map, Observable } from 'rxjs';
import { GlobalState } from 'src/app/core/global-state/app.state';
import { selectToken } from 'src/app/modules/auth/state/authentication.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate, CanLoad {

  private readonly router:Router = inject(Router)
  private store: Store<GlobalState> = inject(Store<GlobalState>)

  token: string = "";

  canActivate(): Observable<boolean | UrlTree>{
    return this.isLogged();
  }
  canLoad(): Observable<boolean | UrlTree>{
    return this.isLogged();
  }

  isLogged():Observable<boolean | UrlTree> {
    return this.store.select(selectToken).pipe(
      first(),
      map(token => {
        return token ? true : this.router.createUrlTree(['/auth'])
      })
    );
  }
}
