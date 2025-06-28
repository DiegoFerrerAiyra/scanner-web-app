import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateLimitsComponent } from '../../../pages/discord/rate-limits/rate-limits.page';

const routes: Routes = [{ path: '', component: RateLimitsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateLimitsRoutingModule { }
