import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDeleteCardApiPayload, IDeleteCardPayload, IDeleteCardResponse, IListCardsResponse } from './models/interfaces/delete-card.interface';
import { Observable } from 'rxjs';

@Injectable()
export class DeleteCardService {
  private readonly BANKING_DOMAIN_URL: string = environment.APIS.BANKING_DOMAIN_URL;

  private readonly http: HttpClient = inject(HttpClient);

  public deleteCard(input: IDeleteCardPayload): Observable<IDeleteCardResponse> {
    const payload: IDeleteCardApiPayload  = {
      card_id: input.cardId,
      user_id: input.modakUserId,
    }

    return this.http.post<IDeleteCardResponse>(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/delete`, payload)
  }

  public listCard(modakUserId: string): Observable<IListCardsResponse> {
    const params = new URLSearchParams()
    params.append("user_id", modakUserId)
    const endpoint = new URL(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/fetch`)
    endpoint.search = params.toString()

    return this.http.get<IListCardsResponse>(endpoint.toString())
  }
}
