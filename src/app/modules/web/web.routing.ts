import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAllowedFeaturesFlagGuard } from '@modules/web/feature-flags/guards/features-flag.guard';


const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: 'feature-flags',
    loadComponent: () => import('../../pages/web/features-flags/features-flags.page').then(component => component.FeaturesFlagsComponent),
    canMatch:[UserAllowedFeaturesFlagGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
