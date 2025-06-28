import { Component, OnInit, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormFetchCards, FormFetchCardsValue, FormReplaceCard } from './models/interfaces/form.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageCardsApi } from '@modules/users/manage-cards/manage-cards.api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';
import { CDescriptions as CDescriptionsShared } from '@shared/models/constants/descriptions.constants';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { SECOND } from '@shared/models/constants/time.constant';
import { CDescriptions } from './models/constants/descriptions.contants';
import { ErrorsManager } from '@core/errors/errors.manager';
import { IDeleteCardPayload, IFetchCard, ReplaceCardPayload } from '@modules/users/manage-cards/models/interfaces/manage-cards.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CARD_STATUS, CARD_STATUS_LABEL, CARD_TYPES, CARD_TYPES_LABEL, LIST_MO_CARDS, MO_CARDS_LABELS, MO_CARDS_VALUES } from '@shared/models/constants/cards.constant';
import { ALL_REASONS } from './models/constants/reasons.contants';
import { TAG_SEVERITY_TYPES } from '@shared/primeng/constants/tag.constants';
import { CFormFields } from './models/constants/manage-cards-form.constant';

@Component({
  selector: 'mdk-manage-cards',
  templateUrl: './manage-cards.page.html',
  styleUrls: ['./manage-cards.page.scss'],
  providers: [ManageCardsApi, ConfirmationService, ClipboardService],

})
export class ManageCardsComponent implements OnInit {
  public readonly EMAILS: string[] = environment.CARD_MANAGEMENT_USERS_ACCEPTED;
  public readonly TYPE_CARDS = CARD_TYPES;
  public readonly moCardsList = LIST_MO_CARDS;
  public readonly moCardsValues = MO_CARDS_VALUES;
  public readonly moCardsLabels = MO_CARDS_LABELS;
  public readonly reasons = ALL_REASONS;
  public readonly typeCards = CARD_TYPES;
  public readonly typeCardsLabels = CARD_TYPES_LABEL;
  public readonly cardStatusLabels = CARD_STATUS_LABEL;
  public readonly cardStatus = CARD_STATUS;
  public readonly formFields = CFormFields;
  public readonly confirmationDialog:string = "CONFIRMATION_DIALOG_MANAGE_CARDS"

  public readonly moCardsDropDownKeys = { labelKeyName: 'label', valueKeyName: 'value' }
  public formFetchCards: FormGroup<FormFetchCards>;
  public formReplaceCard: FormGroup<FormReplaceCard>;
  public listCards: IFetchCard[] = [];
  public showModalFlag: boolean = false;

  public moCardSelected: IFetchCard;
  private modakUserId: string;

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly manageCardService: ManageCardsApi = inject(ManageCardsApi);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);
  private readonly clipboardService: ClipboardService = inject(ClipboardService);
  private readonly errorsManager: ErrorsManager = inject(ErrorsManager);

  ngOnInit(): void {
    this.buildForm();
  }

  //#region [---- PUBLIC METHODS ----]
  public searchCards(): void {
    if (this.formFetchCards.invalid) {
      this.formFetchCards.markAsTouched()
      return
    }

    const values: FormFetchCardsValue = this.formFetchCards.value as FormFetchCardsValue

    this.manageCardService.listCard(values.modakUserId).subscribe({
      next: ({ list_cards }) => {
        if (list_cards.length === 0) {
          this.messageService.add({
            severity: TOAST_SEVERITY_TYPES.INFO,
            detail: CDescriptions.NO_CARDS,
            life: SECOND * 3
          })
          return
        }
        
        this.listCards = list_cards
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

  public openModalReplaceCard(card: IFetchCard) {
    this.showModalFlag = true;
    this.moCardSelected = card;
    this.formReplaceCard.reset();
    this.formReplaceCard.get(this.formFields.CARD_ID).setValue(card.id);
    this.formReplaceCard.get(this.formFields.MODAK_USER_ID).setValue(this.modakUserId);
  }

  public replaceCard() {
    if (this.formReplaceCard.invalid) {
      this.formReplaceCard.markAllAsTouched()
      return
    }

    const card = this.formReplaceCard.value

    const payload: ReplaceCardPayload = {
      cardId: card.cardId?.trim(),
      modakUserId: card.modakUserId?.trim(),
      reason: card.reason?.trim(),
    }

    this.showModalFlag = false
    this.confirmationService.confirm({
      key: this.confirmationDialog,
      header: 'Are you sure to replace this card?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.callApiReplaceCard(payload)
      },
    })
  }

  public deleteCard(card: IFetchCard) {
    if (card.type === CARD_TYPES.VIRTUAL) {
      this.confirmationService.confirm({
        key: this.confirmationDialog,
        header: 'You can not delete a virtual card',
      })

      return
    }

    this.confirmationService.confirm({
      key: this.confirmationDialog,
      header: 'Are you sure to delete this card?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.callApiDeleteCard(card.id)
      },
    })
  }

  public getTypeSeverityByStatus(status: string): string {
    switch(status) {
      case this.cardStatus.ACTIVE:
        return TAG_SEVERITY_TYPES.SUCCESS;
      case this.cardStatus.PENDING:
        return TAG_SEVERITY_TYPES.WARNING;
      case this.cardStatus.CANCELLED:
        return TAG_SEVERITY_TYPES.ERROR;
      default:
        return TAG_SEVERITY_TYPES.INFO;
    }
  }
  //#endregion [---- PUBLIC METHODS ----]

  //#region [---- PRIVATE METHODS ----]
  private callApiDeleteCard(cardId: string): void {
    const payload: IDeleteCardPayload = {
      card_id: cardId,
      user_id: this.modakUserId,
    }

    this.manageCardService.deleteCard(payload).subscribe({
      next: () => {
        this.listCards = this.listCards.filter(_card => _card.id !== cardId)
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

  private callApiReplaceCard(payload: ReplaceCardPayload) {
    this.manageCardService.replaceCard(payload).subscribe({
      next: () => {
        this.messageService.add({
          closable: true,
          severity: TOAST_SEVERITY_TYPES.SUCCESS,
          detail: CDescriptions.SUCCESS_CARD_REPLACE,
        })
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    })
  }

  private buildForm() {
    this.formFetchCards = this.formBuilder.group({
      modakUserId: this.formBuilder.control('', [Validators.required])
    });

    this.formReplaceCard = this.formBuilder.group({
      [this.formFields.CARD_ID]: this.formBuilder.control(''),
      [this.formFields.MODAK_USER_ID]: this.formBuilder.control(''),
      [this.formFields.REASON]: this.formBuilder.control('', [Validators.required]),
    })
  }
  //#endregion [---- PRIVATE METHODS ----]
}
