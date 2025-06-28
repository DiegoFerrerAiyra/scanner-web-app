import { GlobalState } from "src/app/core/global-state/app.state";
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ITokenDecoded, IUser } from '../../modules/auth/models/interfaces/auth.interfaces';

import jwt_decode from "jwt-decode";
import { authActions } from "@modules/auth/state/authentication.actions";
import { AuthApi } from "@modules/auth/auth.api";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorsManager } from "@core/errors/errors.manager";
import { IAwsSignInResponse } from "@modules/auth/models/interfaces/auth.responses";
import { environment } from "src/environments/environment";
import { Location } from '@angular/common';
import { ROLES_AVAILABLE } from "@core/roles/models/constants/roles.constants";

@Component({
  selector: "mdk-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./styles/auth.page.mobile.scss","./styles/auth.page.desktop.scss"],
  providers:[AuthApi]
})
export class AuthComponent implements OnInit {

  //#region [---- DEPENDENCIES ----]

  private store:Store<GlobalState> = inject(Store<GlobalState>)
  private router:Router = inject(Router)
  private authApi:AuthApi = inject(AuthApi)
  private errorsManager:ErrorsManager = inject(ErrorsManager)
  private activateRoute:ActivatedRoute = inject(ActivatedRoute)
  private readonly loc:Location = inject(Location)
  //#endregion

  //#region [---- PROPERTIES ----]

  public loginTempCode:string;

  //#endregion

  //#region [---- LIFE CYCLES ----]

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if(code) {
        this.loginTempCode = code
        this.signIn()
      }
    });
  }
  //#endregion

  //#region [---- LOGIC ----]

  public getAwsSignInCode():void{

    const DOMAIN = environment.AUTH_VARS.DOMAIN
    const LOGIN_PATH="oauth2/authorize"
    const CLIENT_ID=environment.AUTH_VARS.CLIENT_ID
    const SCOPE = 'aws.cognito.signin.user.admin+email+openid+profile'

    const hostName = this.getHostName()
    const REDIRECT = `${hostName}/auth`

    const url = `https://${DOMAIN}/${LOGIN_PATH}?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${REDIRECT}`

    window.location.href = url;

  }

  private signIn():void{
    this.authApi.getTokens(this.loginTempCode).subscribe({
      next: result => this.manageToken(result),
      error: (error: HttpErrorResponse) => this.errorsManager.manageErrors(error)
    })
  }


  private manageToken(tokens:IAwsSignInResponse): void {
    const tokenDecoded: ITokenDecoded = jwt_decode(tokens.id_token);

    const authentication: IUser = {
      name: `${tokenDecoded.given_name} ${tokenDecoded.family_name}`,
      email: tokenDecoded.email,
      accessToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      roles: tokenDecoded["custom:role"].split(',').map(word => word.trim())
    };

    // Save state of user
    this.store.dispatch(authActions.setUser({ authentication }));

    this.router.navigate(["home"]);
  }

  private getHostName():string{
    const angularRoute = this.loc.path();
    const url = window.location.href;
    const domainAndApp = url?.replace(angularRoute, '');
    return domainAndApp
  }

  //#endregion
}
