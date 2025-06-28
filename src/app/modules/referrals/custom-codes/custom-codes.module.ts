import { NgModule } from '@angular/core';
import { ReferralsCustomCodesModuleRouting } from './custom-codes.routing';
import { SharedModule } from '@shared/shared.module';
import { CustomCodesComponent } from '@pages/referrals/custom-codes/custom-codes.page';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        CustomCodesComponent
      ],
    imports: [CommonModule, ReferralsCustomCodesModuleRouting, SharedModule]
})
export class CustomCodesModule { }
