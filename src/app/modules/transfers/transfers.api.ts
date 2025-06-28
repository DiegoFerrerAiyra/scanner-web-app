import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITransferToModakApiPayload, ITransferToModakPayload, ITransferToModakResponse, ITransferToUserApiPayload, ITransferToUserPayload, ITransferToUserResponse } from './models/interfaces/transfers.interface';

@Injectable()
export class TransfersApi {
  
  //#region [---- PROPERTIES ----]
  private readonly BANKING_DOMAIN_URL: string = environment.APIS.BANKING_DOMAIN_URL
  //#endregion

  //#region [---- DEPENDENCIES ----]
  private readonly http: HttpClient = inject(HttpClient)
  //#endregion


  //#region [---- PUBLIC METHODS ----]
  public transferFromUserToModak(payload: ITransferToModakPayload): Observable<ITransferToModakResponse> {
    const endpoint: string = `${this.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_modak`
    const body: ITransferToModakApiPayload = { user_id:payload.userId, amount: payload.amount,description:payload.description }
    return this.http.post<ITransferToModakResponse>(endpoint, body)
  }

  public transferFromModakToUser(payload: ITransferToUserPayload): Observable<ITransferToUserResponse> {
    const endpoint: string = `${this.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_user`
    const body: ITransferToUserApiPayload = { modak_user_id: payload.modakUserId, amount: payload.amount,description:payload.description }
    return this.http.post<ITransferToUserResponse>(endpoint, body)
  }
  //#endregion
}
