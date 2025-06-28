import { FormControl } from "@angular/forms";

export interface IRoleAssociationForm {
    id: FormControl<string>
    rolKey: FormControl<string>;
    modakGroup: FormControl<string>;
  }