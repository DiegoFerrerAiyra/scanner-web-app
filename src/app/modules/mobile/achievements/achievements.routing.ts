import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchievementsComponent } from '@pages/mobile/achievements/achievements.page';


const routes: Routes = [
  {
    path: '',
    component: AchievementsComponent
   },
   {
    path: ':id',
    loadChildren: () => import('./proofs/proofs.module').then(m => m.ProofsModule)
   },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchievementsRoutingModule { }
