import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICardReplaceResponse, IDeleteCardPayload, IDeleteCardResponse, IFetchCardsResponse, ReplaceCardPayload } from './models/interfaces/manage-cards.interface';
import { HttpClient } from '@angular/common/http';
import { CARD_TYPES } from '@shared/models/constants/cards.constant';
import { CQueryParamsManageCards } from './models/constants/manage-cards.contants';

@Injectable()
export class ManageCardsApi {

  private readonly BANKING_DOMAIN_URL: string = environment.APIS.BANKING_DOMAIN_URL;
  private readonly http: HttpClient = inject(HttpClient);

  public listCard(modakUserId: string): Observable<IFetchCardsResponse> {
    const params = new URLSearchParams()
    params.append(CQueryParamsManageCards.user_id, modakUserId)
    const endpoint = new URL(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/fetch`)
    endpoint.search = params.toString()

    return this.http.get<IFetchCardsResponse>(endpoint.toString()).pipe(
      map(res => {
        res.list_cards = res.list_cards.sort((cardA) => {
          if (cardA.type === CARD_TYPES.VIRTUAL) {
            return -1
          }

          return 0
        })
        
        return res
      })
    )
  }

  public deleteCard(input: IDeleteCardPayload): Observable<IDeleteCardResponse> {
    const payload: IDeleteCardPayload = {
      card_id: input.card_id,
      user_id: input.user_id,
    }

    return this.http.post<IDeleteCardResponse>(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/delete`, payload)
  }

  public replaceCard(input: ReplaceCardPayload): Observable<ICardReplaceResponse> {
    const payload = {
      cardholder_user_id: input.modakUserId,
      card_id: input.cardId,
      reason: input.reason || "",
    }

    return this.http.post<ICardReplaceResponse>(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/replace`, payload)
  }
}
