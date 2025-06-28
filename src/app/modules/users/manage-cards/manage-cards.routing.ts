import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCardsComponent } from '@pages/users/manage-cards/manage-cards.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCardsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCardsRoutingModule { }
