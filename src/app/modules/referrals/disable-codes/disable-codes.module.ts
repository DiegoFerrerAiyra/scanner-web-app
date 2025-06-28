import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { DisableCodesComponent } from '@pages/referrals/disable-codes/disable-codes.page';
import { DisableCodesModuleRouting } from './disable-codes.routing';

@NgModule({
    declarations: [
        DisableCodesComponent
      ],
    imports: [CommonModule, DisableCodesModuleRouting, SharedModule]
})
export class DisableCodesModule { }
