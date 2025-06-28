import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICustomCodes, ICreateCustomCodeRequest } from './models/interfaces/custom-codes.interfaces';
import { MODAK_REFERRER_ID } from './models/constants/custom-codes.constants';



@Injectable()

export class ReferralsApi {

  private readonly http:HttpClient = inject(HttpClient)
  private USERS_DOMAIN_URL: string = environment.APIS.USERS_DOMAIN_URL;

  public createCustomCodes(customCode: ICustomCodes) : Observable<void> {
    const payload: ICreateCustomCodeRequest = {code: customCode.code, reward_id: customCode.reward_id,  referrer_id: MODAK_REFERRER_ID}
    return this.http.post<void>(`${this.USERS_DOMAIN_URL}/backoffice/v1/referral/custom-code`, payload)
  }
}


