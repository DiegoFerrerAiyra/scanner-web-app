import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ReplaceCardPayload } from '@pages/users/replace-card/models/interfaces/form.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICardReplaceResponse } from './models/interface/response.interface';

@Injectable()
export class ReplaceCardService {

  private readonly BANKING_DOMAIN_URL: string = environment.APIS.BANKING_DOMAIN_URL;

  private readonly http: HttpClient = inject(HttpClient);

  public replaceCard(input: ReplaceCardPayload): Observable<ICardReplaceResponse> {
    const payload = {
      cardholder_user_id: input.modakUserId,
      card_id: input.cardId,
      reason: input.reason || "",
    }
    
    return this.http.post<ICardReplaceResponse>(`${this.BANKING_DOMAIN_URL}/backoffice/v1/card/replace`, payload)
  }
}
