import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProofsComponent } from '@pages/mobile/achievements/sub-pages/proofs/proofs.page';


const routes: Routes = [{ path: '', component: ProofsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProofsRoutingModule { }
