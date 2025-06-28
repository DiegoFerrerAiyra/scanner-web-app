import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormReplaceCard, ReplaceCardPayload } from './models/interfaces/form.interface';
import { MessageService } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';

import { CDescriptions as CDescriptionsShared } from '@shared/models/constants/descriptions.constants';
import { ReplaceCardService } from '@modules/users/replace-card/replace-card.api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { ALL_REASONS } from './models/constants/reasons.contants';
import { CDescriptions } from './models/constants/descriptions.contants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mdk-replace-card',
  templateUrl: './replace-card.page.html',
  styleUrls: ['./replace-card.page.scss'],
  providers: [ReplaceCardService, ClipboardService],
})
export class ReplaceCardComponent implements OnInit {

  //#region [---- PROPERTIES ----]
  public readonly emails: string[] = environment.CARD_MANAGEMENT_USERS_ACCEPTED;
  public readonly reasons = ALL_REASONS;
  public formReplaceCard:FormGroup<FormReplaceCard>;
  public cardId: string = ""
  //#endregion

  //#region [---- DEPENDENCIES ----]
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly errorsManager: ErrorsManager = inject(ErrorsManager);
  private readonly replaceCardApi: ReplaceCardService = inject(ReplaceCardService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly clipBoardServicer: ClipboardService = inject(ClipboardService);
  //#endregion

  //#region [---- HOOKS ----]
  ngOnInit(): void {
    this.buildForm()
  }
  //#endregion

  //#region [---- PUBLIC METHODS ----]
  public submit(): void {
    if(this.formReplaceCard.invalid) {
      return
    }

    const value: ReplaceCardPayload = this.formReplaceCard.value as ReplaceCardPayload
    for(let key in value) {
      value[key] = (value[key] as string).trim()
    }

    this.replaceCardApi.replaceCard(value).subscribe({
      next: (response) => {
        this.cardId = response.card_id
        this.messageService.add({
          closable:true,
          severity: TOAST_SEVERITY_TYPES.SUCCESS,
          detail: CDescriptions.SUCCESS_DETAILS,
        })
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    })
  }

  public onCopy() {
    this.clipBoardServicer.copy(this.cardId)
    this.messageService.add({
      closable: true,
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptionsShared.COPIED,
    })
  }
  //#endregion

  //#region [---- PRIVATE METHODS ----]
  private buildForm(): void {
    this.formReplaceCard = this.formBuilder.group({
      cardId: this.formBuilder.control('', [Validators.required]),
      modakUserId: this.formBuilder.control('', [Validators.required]),
      reason: this.formBuilder.control('', [Validators.required]),
    })
  }
  //#endregion
}
