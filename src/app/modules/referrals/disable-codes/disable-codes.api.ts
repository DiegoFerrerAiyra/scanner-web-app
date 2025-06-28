import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDisableCodeRequest } from './models/interfaces/disable-codes.interfaces';



@Injectable()

export class DisableCodesApi {

  private readonly http:HttpClient = inject(HttpClient)
  private readonly BASE_URL: string = environment.APIS.USERS_DOMAIN_URL;

  public disableCode(idInput: string) : Observable<void> {
    const payload: IDisableCodeRequest = {id: idInput}
    return this.http.post<void>(`${this.BASE_URL}/backoffice/v1/referral/disable-code`, payload)
  }

  public enableCode(idInput: string) : Observable<void> {
    const payload: IDisableCodeRequest = {id: idInput}
    return this.http.post<void>(`${this.BASE_URL}/backoffice/v1/referral/enable-code`, payload)
  }
}


