import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ITokenDecoded, ITokensUser, IUser } from '@modules/auth/models/interfaces/auth.interfaces';
import { selectAllTokens, selectUser } from '@modules/auth/state/authentication.selectors';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { GlobalState } from 'src/app/core/global-state/app.state';
import jwt_decode from "jwt-decode";

// actions
import { logoutAction } from '../../core/global-state/reducers/clear/clearState.actions'
import { authActions } from '@modules/auth/state/authentication.actions';
import { AuthApi } from '@modules/auth/auth.api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly router:Router = inject(Router)
  private readonly store:Store<GlobalState> = inject(Store<GlobalState>)
  private readonly authApi:AuthApi = inject(AuthApi)

  async getToken():Promise<string | void>{
    // get tokens from the store
    const tokensStore = await firstValueFrom(this.getAllTokensFromStore())

    if(!tokensStore.accessToken) return ''

    const isExpired:boolean = await this.verifyExpiredToken(tokensStore.accessToken)
    if(!isExpired) return tokensStore.accessToken


    const newAccessToken = ""// await this.getNewAccessToken(tokensStore.refreshToken)
    return newAccessToken
  }

  private getAllTokensFromStore():Observable<ITokensUser>{
    return this.store.select(selectAllTokens).pipe(
        first()
    )
  }

  private async verifyExpiredToken(token:string):Promise<boolean>{
    const tokenDecoded:ITokenDecoded = jwt_decode(token);
    const tokenDateExp:number = tokenDecoded.exp * 1000
    const now = Date.now()

    return now >= tokenDateExp

  }


  getUserFromStore():Observable<IUser>{
    return this.store.select(selectUser).pipe(
      first()
    )
  }

  public logout():void{
    this.store.dispatch(logoutAction());
    const saveTheme = localStorage.getItem('saveTheme') || ''
    localStorage.clear();
    sessionStorage.clear();

    localStorage.setItem('saveTheme',saveTheme)

    this.router.navigate([`/auth`])
  }
}
