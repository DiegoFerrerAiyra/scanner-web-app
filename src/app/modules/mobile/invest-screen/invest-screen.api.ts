import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeleteItemInvestResponse, IGetInvestScreenItems, IinvestScreenItem, IReOrderList } from '@modules/mobile/invest-screen/models/interfaces/invest-screen.interfaces';

@Injectable({
  providedIn: 'root'
})
export class InvestScreenApi {

  private readonly http:HttpClient = inject(HttpClient)
  private MONOLITH_URL: string = environment.APIS.MONOLITH_URL;

  getItems():Observable<IGetInvestScreenItems> {
    return this.http.get<IGetInvestScreenItems>(`${this.MONOLITH_URL}/backoffice/invests`)
  }

  createItem(item:IinvestScreenItem):Observable<IinvestScreenItem> {
    return this.http.post<IinvestScreenItem>(`${this.MONOLITH_URL}/backoffice/invests`,item)
  }

  updateItem(item:IinvestScreenItem):Observable<IinvestScreenItem> {
    return this.http.put<IinvestScreenItem>(`${this.MONOLITH_URL}/backoffice/invests/${item.uuid}`,item)
  }

  deleteItem(item:IinvestScreenItem):Observable<IDeleteItemInvestResponse> {
    return this.http.delete<IDeleteItemInvestResponse>(`${this.MONOLITH_URL}/backoffice/invests/${item.uuid}`)
  }

  reOrderItems(items:IReOrderList[]):Observable<IReOrderList[]>{
    return this.http.post<IReOrderList[]>(`${this.MONOLITH_URL}/backoffice/invests/reorder`,items)
  }


}
