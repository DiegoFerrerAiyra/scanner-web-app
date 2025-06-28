import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeleteCardComponent } from '@pages/users/delete-card/delete-card.page';

const routes: Routes = [
  { 
    path: '', component: DeleteCardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeleteCardRoutingModule { }
