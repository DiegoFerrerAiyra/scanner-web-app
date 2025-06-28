import { AbstractControl, ValidatorFn } from "@angular/forms";
import { CEmailValidatorRegex } from "@shared/models/constants/email.constants";


export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const REGEX = CEmailValidatorRegex
      const isValid = email && email.match(REGEX);
      return isValid ? null : { invalidEmail: true };
    };
}








