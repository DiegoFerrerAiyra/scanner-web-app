import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IFileItem } from '@pages/users/mint/models/constants/mint.interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MintApi {

  private readonly http:HttpClient = inject(HttpClient)

  private BASE_URL: string = environment.LEDGER_API_URL;

  mintImportUpload(item: IFileItem): Observable<void>{
    const url = `${this.BASE_URL}/payments/v1`;
    return this.http.post<void>(url, item);
  }
}
