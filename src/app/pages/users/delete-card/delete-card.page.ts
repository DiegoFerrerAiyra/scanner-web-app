import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';

import { ErrorsManager } from '@core/errors/errors.manager';
import { DeleteCardService } from '@modules/users/delete-card/delete-card.api';
import { IDeleteCardPayload } from '@modules/users/delete-card/models/interfaces/delete-card.interface';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { SECOND } from '@shared/models/constants/time.constant';
import { CDescriptions as CDescriptionsShared } from "@shared/models/constants/descriptions.constants";
import { environment } from 'src/environments/environment';
import { FormValueDeleteCard, FormDeleteCard } from './models/interfaces/form.interface';
import { CDescriptions } from './models/constants/descriptions.contants';

@Component({
  selector: 'mdk-delete-card',
  templateUrl: './delete-card.page.html',
  styleUrls: ['./delete-card.page.scss'],
  providers: [DeleteCardService, ConfirmationService, ClipboardService],
})
export class DeleteCardComponent implements OnInit {
  //#region [---- PROPERTIES ----]
  public readonly emails: string[] = environment.CARD_MANAGEMENT_USERS_ACCEPTED;
  public formDeleteCard: FormGroup<FormDeleteCard>;
  public listCardsIds: string[] = [];
  private modakUserId:string = "";
  //#endregion

  //#region [---- DEPENDENCIES ----]
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly errorsManager: ErrorsManager = inject(ErrorsManager);
  private readonly deleteCardService: DeleteCardService = inject(DeleteCardService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);
  private readonly clipboardService: ClipboardService = inject(ClipboardService);
  //#endregion [---- DEPENDENCIES ----]

  //#region [---- LIFE CYCLE HOOKS ----]
  ngOnInit(): void {
    this.buildForm();
  }
  //#endregion

  //#region [---- PUBLIC GETTERS ----]
  public get formValueDeleteCard(): FormValueDeleteCard {
    return this.formDeleteCard.value as FormValueDeleteCard
  } 

  //#region [---- PUBLIC METHODS ----]
  public searchCards(): void {    
    if(this.formDeleteCard.invalid) {
      this.formDeleteCard.markAsTouched()
      return
    }

    const values: FormValueDeleteCard = this.formDeleteCard.value as FormValueDeleteCard

    this.deleteCardService.listCard(values.modakUserId).subscribe({
      next: ({ list_cards }) => {
        if(list_cards.length === 0) {
          this.messageService.add({
            severity: TOAST_SEVERITY_TYPES.INFO,
            detail: CDescriptions.NO_CARDS,
            life: SECOND * 3
          })
          return
        }
        this.listCardsIds = list_cards
        this.modakUserId = values.modakUserId
      },
      error: err => this.errorsManager.manageErrors(err)
    })
  }

  public copy(copyText: string): void {
    this.clipboardService.copy(copyText);
    this.messageService.add({
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptionsShared.COPIED,
      closable: true,
      life: SECOND * 3
    })
  }

  public deleteCard(cardId: string) {
    this.confirmationService.confirm({
      key: "positionDialog",
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.callApiDeleteCard(cardId)
      },
    })
  }
  //#endregion [---- PUBLIC METHODS ----]

  //#region [---- PRIVATE METHODS ----]
  private callApiDeleteCard(cardId: string) {
    const payload: IDeleteCardPayload = {
      cardId: cardId,
      modakUserId: this.modakUserId,
    }

    this.deleteCardService.deleteCard(payload).subscribe({
      next: () => {
        this.listCardsIds = this.listCardsIds.filter(_cardId => cardId !== _cardId)
        this.messageService.add({
          severity: TOAST_SEVERITY_TYPES.SUCCESS,
          detail: CDescriptions.SUCCESS_CARD_DELETE,
          closable: true,
          life: SECOND * 3,
        })
      },
      error: (error: HttpErrorResponse) => this.errorsManager.manageErrors(error)
    })
  }
  private buildForm() {
    this.formDeleteCard = this.formBuilder.group({
      modakUserId: this.formBuilder.control('', [Validators.required])
    })
  }
  //#endregion [---- PRIVATE METHODS ----]
}
