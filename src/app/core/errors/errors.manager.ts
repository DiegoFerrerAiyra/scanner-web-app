import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorCustomMessages } from './models/constants/custom-messages.constants';

import { CErrorMessages } from '@core/errors/models/constants/product-messages.constants';
import { errorContextType } from '@core/errors/models/types/errors.types';
import { NewErrorBodyModak, NewErrorModak } from '@core/errors/models/interface/error-modak';
import { MINUTE } from '@shared/models/constants/time.constant';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';




@Injectable({
  providedIn: 'root'
})
export class ErrorsManager {

  private defaultSummary: string = 'Error'
  private messageService: MessageService = inject(MessageService)

  public manageErrors(error: HttpErrorResponse | NewErrorModak,context?:errorContextType): void {

    // IS HTTP ERROR
    if(error instanceof HttpErrorResponse) {

      // See with Product this after
      if (error.status >= 500) {
        this.showMessageOnToast(ErrorCustomMessages.DEFAULT_5XX)
        return
      }

      const bodyHttpError = error.error

      // Verify if is new Modak Error
      if(bodyHttpError.hasOwnProperty('errors')) {
        const modakErrors = bodyHttpError.errors

        const errorMessage = this.getMessage(modakErrors,context)

        this.showMessageOnToast(errorMessage)
        return;
      }

      // Verify if is old Modak Error
      if(bodyHttpError.hasOwnProperty('cause')) {
        const { cause } = bodyHttpError
        const errorMessage = cause ? cause : ErrorCustomMessages.DEFAULT_NOT_5XX
        this.showMessageOnToast(errorMessage)
        return;
      }

      this.showMessageOnToast(ErrorCustomMessages.DEFAULT_NOT_5XX)
      return
    }

    // IS MODAK ERROR
    if(error instanceof NewErrorModak){
      const modakErrors = error.errors
      const errorMessage = this.getMessage(modakErrors,context)
      const summary = modakErrors[0]?.summary
      this.showMessageOnToast(errorMessage,summary)
    }
  }

  private getMessage(modakErrors:NewErrorBodyModak[],context:errorContextType | undefined):string{
    // get last two errors from array

    const lastError = modakErrors[modakErrors.length - 1];

    const productMessage = this.getProductErrorMessage(lastError?.code,context)
    return productMessage ? productMessage : `${lastError?.message}`
  }

  private getProductErrorMessage(errorCode: string, context: errorContextType | undefined): string {
    if (!CErrorMessages.hasOwnProperty(errorCode) || !context) {
        return '';
    }
    return CErrorMessages[errorCode].hasOwnProperty(context) ? CErrorMessages[errorCode][context] : '';
  }

  private showMessageOnToast(message:string,summary?:string){
      this.messageService.add({
        life: MINUTE,
        severity: TOAST_SEVERITY_TYPES.ERROR,
        summary: summary  || this.defaultSummary,
        detail: message
      });
  }
}
