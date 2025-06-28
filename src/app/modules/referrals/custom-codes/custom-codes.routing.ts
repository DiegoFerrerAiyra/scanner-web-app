import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomCodesComponent } from '@pages/referrals/custom-codes/custom-codes.page';

const routes:Routes = [{path: "", component: CustomCodesComponent}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReferralsCustomCodesModuleRouting { }
