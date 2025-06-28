import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NO_INSERT_TOKEN } from '@core/interceptors/constants/interceptors.constants';
import { GlobalService } from '@core/services/global.service';
import { IAwsSignInResponse } from '@modules/auth/models/interfaces/auth.responses';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {

  private readonly http:HttpClient = inject(HttpClient)
  private readonly globalService:GlobalService = inject(GlobalService)

  getTokens(loginCode:string):Observable<IAwsSignInResponse>{

    const DOMAIN= environment.AUTH_VARS.DOMAIN
    const TOKEN_PATH="oauth2/token"
    const CLIENT_ID = environment.AUTH_VARS.CLIENT_ID
    const REDIRECT_URI = this.globalService.isLocalhost() ? `${environment.LOCAL_URL}/auth` : environment.AUTH_VARS.REDIRECT_URI

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded'
    })

    const body = new HttpParams()
      .set('grant_type','authorization_code')
      .set('client_id',CLIENT_ID)
      .set('redirect_uri',REDIRECT_URI)
      .set('code',loginCode)

    const url = `https://${DOMAIN}/${TOKEN_PATH}`
    return this.http.post<IAwsSignInResponse>(url,body,{headers})
  }

  refreshToken(refreshToken:string):Observable<string>{

    const DOMAIN = environment.AUTH_VARS.DOMAIN
    const REFRESH_PATH="oauth2/token"
    const CLIENT_ID = environment.AUTH_VARS.CLIENT_ID

    const options = {
      context: new HttpContext().set(NO_INSERT_TOKEN, true),
      headers:{
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }

    const body = new HttpParams()
    .set('grant_type','refresh_token')
    .set('client_id',CLIENT_ID)
    .set('refresh_token',refreshToken)

    const url = `${DOMAIN}/${REFRESH_PATH}`

    return this.http.post<IAwsSignInResponse>(url,body.toString(),options).pipe(
      map(response => response.access_token),
    )
  }


}
