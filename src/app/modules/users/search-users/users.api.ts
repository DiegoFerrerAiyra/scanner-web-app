import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorsManager } from '@core/errors/errors.manager';
import { ErrorCustomMessages } from '@core/errors/models/constants/custom-messages.constants';
import { NewErrorModak } from '@core/errors/models/interface/error-modak';
import { HIDE_SPINNER } from '@core/interceptors/constants/interceptors.constants';
import { UsersUtils } from '@modules/users/search-users/users.utils';
import { CAccountStatus } from '@pages/users/search-users/models/constants/accountStatus.constants';
import { IBalanceResponse, ICloseAccountRequest, ICloseAccountResponse, ICloseAccountStateResponse, IGetPersonIdResponse, IQueryParamsAccepted, ISearchUserResponse, IUsersForTable } from '@pages/users/search-users/models/interfaces/searchUsers.interface';
import { AccountStatus } from '@pages/users/search-users/models/types/accountStatus.types';
import { SECOND } from '@shared/models/constants/time.constant';
import { catchError, last, map, Observable, Subject, switchMap, take, takeUntil, tap, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsersApi {

  //#region [---- DEPENDENCIES ----]

  private readonly errorsManager: ErrorsManager = inject(ErrorsManager)
  private readonly http: HttpClient = inject(HttpClient)
  private readonly usersUtils: UsersUtils = inject(UsersUtils)
    //#endregion

  private USERS_DOMAIN_URL: string = environment.APIS.USERS_DOMAIN_URL;
  private LEDGER_DOMAIN_URL: string = environment.LEDGER_API_URL;

  public searchUsers(queryParamsSend: IQueryParamsAccepted): Observable<IUsersForTable[]> {

    let params = new HttpParams()

    if (queryParamsSend.phone) params = params.append('phone', queryParamsSend.phone?.trim())
    if (queryParamsSend.email) params = params.append('email', queryParamsSend.email?.trim())
    if (queryParamsSend.modak_id) params = params.append('modakID', queryParamsSend.modak_id?.trim())
    
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/search-users`;

    return this.http.get<ISearchUserResponse[]>(url, { params }).pipe(
      map(data => data.length ? this.usersUtils.transformDataSearched(data) : []),
    )
  }

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

  public pullingStateCloseAccount(response:ICloseAccountResponse): Observable<AccountStatus> {
    const { process_id: processId, timeout } = response;

    const stopPolling$ = new Subject<void>();
    const MAX_TRIES = timeout / SECOND;

    return timer(0, SECOND)
    .pipe(
      take(MAX_TRIES),
      takeUntil(stopPolling$),
      switchMap(() => this.stateCloseAccount(processId)),
      map((response:ICloseAccountStateResponse) => response.deletion_status),
      tap((status:AccountStatus) => {
        if(status !== CAccountStatus.ACTIVE && status !== CAccountStatus.DELETE_IN_PROGRESS){
            stopPolling$.next();
            stopPolling$.complete();
        }
      }),
      last(),
      map(status => {
        if(status !== CAccountStatus.ACTIVE && status !== CAccountStatus.DELETE_IN_PROGRESS){
          return status
        }
        const timeoutError = new NewErrorModak({
          code:'',
          message:ErrorCustomMessages.CLOSE_ACCOUNT_TIMEOUT
        })
        throw timeoutError

      }),
      catchError((error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
        return throwError(() => error);
      })
    );
  }

  private stateCloseAccount(userId:string):Observable<ICloseAccountStateResponse>{
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/close-account/processes/${userId}`;
    const options = {
      context: new HttpContext().set(HIDE_SPINNER, true)
    }

    return this.http.get<ICloseAccountStateResponse>(url,options)
  }

  public getPersonId(userId:string):Observable<string>{
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/close-account/${userId}/person`;

    return this.http.get<IGetPersonIdResponse>(url).pipe(
      map(response => response.person_id),
      catchError((error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
        return throwError(() => error);
      })
    )
  }

  public getBalance(userId:string):Observable<IBalanceResponse[]>{
    const url = `${this.LEDGER_DOMAIN_URL}/balances/v1/${userId}`;

    return this.http.get<IBalanceResponse[]>(url).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
        return throwError(() => error);
      })
    )
  }

  public getPIIUserData(userId: string): Observable<IUsersForTable> {
    const url = `${this.USERS_DOMAIN_URL}/backoffice/v1/users/pii/${userId}`;

    return this.http.get<ISearchUserResponse>(url).pipe(
      map(x => this.usersUtils.transformDataSearched([x])),
      map(x => x[0])
    )
  }
}
