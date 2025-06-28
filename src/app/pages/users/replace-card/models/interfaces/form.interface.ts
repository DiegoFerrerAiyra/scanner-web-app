import { FormControl } from "@angular/forms";

export interface FormReplaceCard {
    modakUserId: FormControl<string>
    cardId: FormControl<string>
    reason: FormControl<string>
}

export interface ReplaceCardPayload {
    modakUserId: string
    cardId: string
    reason: string
}
