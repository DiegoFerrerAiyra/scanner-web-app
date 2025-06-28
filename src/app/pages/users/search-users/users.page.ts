import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UsersApi } from '@modules/users/search-users/users.api';

import { ICloseAccountRequest, IQueryParamsAccepted, IUsersForTable } from '@pages/users/search-users/models/interfaces/searchUsers.interface';
import { ErrorsManager } from '@core/errors/errors.manager';
import { ModalType } from '@shared/components/dumb/confirm-modal/models/types/confirm-modal.types';
import { CModalType } from '@shared/components/dumb/confirm-modal/models/constants/confirm-modal.constants';
import { CAccountStatus, CBankAccountStatus, optionsForCloseAccount } from '@pages/users/search-users/models/constants/accountStatus.constants';
import { ActionUsersModal } from '@pages/users/search-users/models/types/searchUsers.types';
import { CActionsUsersModal } from '@pages/users/search-users/models/constants/search-users.constants';
import { environment } from 'src/environments/environment';
import { LoaderService } from '@shared/components/dumb/spinner/loader.service';
import { first, map, mergeMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalState } from '@core/global-state/app.state';
import { selectUser } from '@modules/auth/state/authentication.selectors';
import { C_USER_ROLES, Currencies } from './models/constants/users.constants';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'mdk-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  providers: [UsersApi]
})
export class UsersComponent implements OnInit {

  //#region DEPENDENCIES
  private readonly searchUsersApi: UsersApi = inject(UsersApi)
  private readonly errorsManager: ErrorsManager = inject(ErrorsManager)
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly store:Store<GlobalState> = inject(Store<GlobalState>)
  //#endregion

  //#region PROPERTIES
  public inputPhone: string = '';
  public inputEmail: string = '';
  public inputModakId: string = '';

  private queryParamsTemporally:IQueryParamsAccepted;

  public disabledSubmit: boolean = true
  public users: IUsersForTable[] = []

  public expandedRows: expandedRows = {};
  public isExpanded: boolean = false;

  public showConfirmModal: boolean = false
  public typeModal:ModalType;
  public titleModal:string;
  public labelThirdButtonModal:string;
  public optionsForRadioModal: string[];
  private userSaveModal!: IUsersForTable | null;
  private actionForModal:ActionUsersModal;

  //REFACTOR: use translate
  public messageForModalConfirm: string = "Are you sure that you want to verify this user:";

  public isAdminAvailable:boolean = false

  public BANK_ACCOUNT_STATUS = CBankAccountStatus;
  public ACCOUNT_STATUS = CAccountStatus;
  public USER_ROLES = C_USER_ROLES;

  //#region [---- LIFE CYCLES ----]

  ngOnInit(): void {
    this.store.select(selectUser).pipe(
      first(),
      map( dataUser => dataUser.email)
    ).subscribe(email => {
      if(environment.production){
        this.isAdminAvailable = environment.ACCOUNT_CANCELATION_USERS_ACCEPTED.some(adminEmail => adminEmail === email)
        return
      }
      this.isAdminAvailable = true // dev mode
    })
  }

  //#endregion

  //#region [---- FORM ----]

  private resetForm(): void {
    this.disabledSubmit = false
    this.inputPhone = ''
    this.inputEmail = ''
    this.verifyInputs()
  }

  public verifyInputs(): void {
    this.disabledSubmit = (this.inputPhone || this.inputEmail || this.inputModakId) ? false : true
  }

  //#endregion

  //#region [---- API LOGIC ----]

  public seePIIData(user: IUsersForTable, index: number) {
    this.searchUsersApi.getPIIUserData(user.uuid).subscribe({
      next: (usr) => this.users[index] = usr
    })
  }

  public searchUsers(reload?:boolean): void {
    let queryParams: IQueryParamsAccepted;
    if(reload){
      queryParams = this.queryParamsTemporally
    } else {
      const phone = this.inputPhone ? `+${this.inputPhone}` : ""
      queryParams = {
        phone: phone.trim(),
        email: this.inputEmail.trim(),
        modak_id: this.inputModakId.trim()
      }
      this.queryParamsTemporally = queryParams
    }
    this.searchUsersApi.searchUsers(queryParams)
    .pipe(
      mergeMap(user=>{
        return this.searchUsersApi.getBalance(user[0]?.uuid).pipe(map(balance =>{
          const mbx_balance = balance?.filter(balance => balance?.currency === Currencies.MBX)[0]?.settled_amount.toString()
          return [{...user[0], mbx_balance}] as IUsersForTable[]
        }))
      
      }))
    .subscribe({
      next: result => {
        this.users = result
        this.resetForm()
      },
      error: (error: HttpErrorResponse) => {
        this.resetForm()
        this.errorsManager.manageErrors(error)
      }
    })
  }

  //#endregion

  //#region [---- MODAL LOGIC ----]
  private openModal(): void {
    this.showConfirmModal = !this.showConfirmModal
  }

  public setModalForCloseAccount(user:IUsersForTable):void{
    this.userSaveModal = user;
    this.typeModal = CModalType.RADIO
    this.actionForModal = CActionsUsersModal.CLOSE_ACCOUNT
    this.titleModal = `Are you sure you want to close the account of ${user.name}?` //REFACTOR: translate
    this.messageForModalConfirm = 'Select a choice' //REFACTOR: translate
    this.optionsForRadioModal = optionsForCloseAccount
    this.openModal()
  }

  public setModalForPendingCloseAccount(user:IUsersForTable):void{
    this.userSaveModal = user;
    this.typeModal = CModalType.MESSAGE
    this.actionForModal = CActionsUsersModal.PENDING_CLOSE_ACCOUNT
    this.titleModal = `Pending manual account closure of ${user.name}` //REFACTOR: translate
    this.messageForModalConfirm = 'Go to close it manually?'
    this.labelThirdButtonModal = 'I have already verified manually'
    this.openModal()
  }

  public handleConfirmModal(event: boolean | string) {
    if (event) {
      switch (this.actionForModal) {
        case CActionsUsersModal.PENDING_CLOSE_ACCOUNT:
          this.goToCloseAccountManually()
          break;
        case CActionsUsersModal.CLOSE_ACCOUNT:
          const reason = typeof event === 'string' ? event : ''
          this.closeAccount(reason)
          break;
        default:
          break;
      }
      return
    }
    this.showConfirmModal = false
    this.userSaveModal = null
  }

  public handleThirdActionModal():void{
    this.showConfirmModal = false
    this.confirmAccountWasClosed()
  }

  //#endregion

  //#region [---- CLOSE ACCOUNT LOGIC  ----]

  private closeAccount(reason:string):void{
    this.showConfirmModal = false
    this.loaderService.show()
    const request:ICloseAccountRequest = {
      reason,
      user_id: this.userSaveModal.uuid
    }
    this.searchUsersApi.closeUserAccount(this.userSaveModal.uuid,request).pipe(
      mergeMap(response => {
        return this.searchUsersApi.pullingStateCloseAccount(response)
      })
    )
    .subscribe({
      next: () => {
        this.loaderService.hide()
        this.searchUsers(true)
      },
      error: () => {
        this.loaderService.hide()
      },
    })
  }

  private goToCloseAccountManually():void {
    this.searchUsersApi.getPersonId(this.userSaveModal.uuid).subscribe({
      next: personId => {
        this.showConfirmModal = false
        const urlSolid = `${environment.SOLID.URL_DASHBOARD}/person?status=all&limit=20&offset=0&id=${personId}&envmode=${environment.SOLID.ENV}`
        window.open(urlSolid, "_blank")
      },
    })
  }

  private confirmAccountWasClosed():void{
     this.searchUsers(true)
  }

  //#endregion
}
