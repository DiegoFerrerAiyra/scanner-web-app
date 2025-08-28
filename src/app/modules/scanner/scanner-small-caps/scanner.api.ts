import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorsManager } from '@core/errors/errors.manager';
import { IMicroCapsScanner } from '@pages/scanner/scanner-small-caps/models/interfaces/searchUsers.interface';
import {Observable} from 'rxjs';

@Injectable()
export class ScannerApi {

  //#region [---- DEPENDENCIES ----]

  private readonly errorsManager: ErrorsManager = inject(ErrorsManager)
  private readonly http: HttpClient = inject(HttpClient)
    //#endregion

  private USERS_DOMAIN_URL: string = ""

  public searchUsers(): Observable<IMicroCapsScanner[]> {
    
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/search-users`;

    return this.http.get<any[]>(url)
  }

  /* 
  public closeUserAccount(userId:string,request:ICloseAccountRequest){
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/close-account`;

    const options = {
      context: new HttpContext().set(HIDE_SPINNER, true)
    }

    return this.http.post<ICloseAccountResponse>(url,request,options).pipe(
      map(() => {
          return {
            process_id: userId,
            timeout: 60000
          }
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
        return throwError(() => error);
      })
    )
  }
  */

}
