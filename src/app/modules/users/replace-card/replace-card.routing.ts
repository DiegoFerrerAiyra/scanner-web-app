import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReplaceCardComponent } from '@pages/users/replace-card/replace-card.page';

const routes: Routes = [
  { path: '', component: ReplaceCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplaceCardRoutingModule { }
