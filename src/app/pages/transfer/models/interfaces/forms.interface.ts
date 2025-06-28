import { FormControl } from "@angular/forms";

export interface FormTransfer {
    transferTo: FormControl<string>,
    userId: FormControl<string>,
    amount: FormControl<string>,
    description: FormControl<string>,
}

export interface FormTransferValues {
    transferTo: string,
    userId: string,
    amount: string,
    description: string;
}