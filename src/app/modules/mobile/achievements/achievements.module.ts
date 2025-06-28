import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchievementsRoutingModule } from './achievements.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { AchievementsComponent } from '@pages/mobile/achievements/achievements.page';


@NgModule({
  declarations: [
    AchievementsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AchievementsRoutingModule
  ]
})
export class AchievementsModule { }
