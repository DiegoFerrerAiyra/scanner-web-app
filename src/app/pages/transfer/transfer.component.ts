import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';

import { ErrorsManager } from '@core/errors/errors.manager';
import { TransfersApi } from '@modules/transfers/transfers.api';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { environment } from 'src/environments/environment';
import { FormTransfer, FormTransferValues } from './models/interfaces/forms.interface';
import { ALL_DESCRIPTIONS, CDescriptions, TRANSFER_TO } from './models/constants/transfer.constants';
import { CDescriptions as CDescriptionsShared } from '@shared/models/constants/descriptions.constants';

@Component({
  selector: 'mdk-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  providers: [TransfersApi],
})
export class TransferComponent implements OnInit {
  public readonly emails: string[] = environment.TRANSFER_MANAGEMENT_USERS_ACCEPTED;
  public readonly stateOptions = Object.values(TRANSFER_TO);
  public formTransferToUser: FormGroup<FormTransfer>;
  public value: string = 'off';
  public transferId: string = ""

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly transferApi: TransfersApi = inject(TransfersApi);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly errorsManager: ErrorsManager = inject(ErrorsManager);
  private readonly clipBoardServicer: ClipboardService = inject(ClipboardService);

  public readonly descriptionOptions = ALL_DESCRIPTIONS;

  ngOnInit(): void {
    this.buildForm()
  }

  public submit(): void {
    if (this.formTransferToUser.invalid) {
      this.formTransferToUser.markAllAsTouched()
      return
    }

    const values = this.formTransferToUser.value as FormTransferValues

    if (values.transferTo === TRANSFER_TO.MODAK) {
      this.transferToModak(values)
      return
    }

    this.transferToUser(values)
  }

  public onCopy() {
    this.clipBoardServicer.copy(this.transferId)
    this.messageService.add({
      closable: true,
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptionsShared.COPIED,
    })
  }

  private buildForm(): void {
    this.formTransferToUser = this.fb.group({
      transferTo: this.fb.control('', [Validators.required]),
      userId: this.fb.control('', [Validators.required]),
      amount: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
    })
  }

  private transferToModak(values: FormTransferValues) {
    this.transferId = "";
    this.transferApi.transferFromUserToModak({ amount: `${values.amount}`, userId: values.userId,description:values.description }).subscribe({
      next: (response) => {
        this.transferId = response.transfer_id;
        this.messageService.add({
          severity: TOAST_SEVERITY_TYPES.SUCCESS,
          detail: CDescriptions.SUCCESS_TRANSFER
        })
      },
      error: err => this.errorsManager.manageErrors(err)
    })
  }

  private transferToUser(values: FormTransferValues) {
    this.transferId = "";
    this.transferApi.transferFromModakToUser({ amount: `${values.amount}`, modakUserId: values.userId,description:values.description }).subscribe({
      next: (response) => {
        this.transferId = response.transfer_id;
        this.messageService.add({
          severity: TOAST_SEVERITY_TYPES.SUCCESS,
          detail: CDescriptions.SUCCESS_TRANSFER
        })
      },
      error: err => this.errorsManager.manageErrors(err)
    })
  }
}
