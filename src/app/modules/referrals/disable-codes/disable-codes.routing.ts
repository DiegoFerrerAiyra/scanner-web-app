import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisableCodesComponent } from '@pages/referrals/disable-codes/disable-codes.page';

const routes:Routes = [{path: "", component: DisableCodesComponent}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DisableCodesModuleRouting { }
