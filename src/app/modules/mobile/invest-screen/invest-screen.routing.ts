import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestScreenComponent } from '@pages/mobile/invest-screen/invest-screen.page';


const routes: Routes = [{ path: '', component: InvestScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestScreenRoutingModule { }
