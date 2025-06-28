import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushNotificationsRoutingModule } from './push-notifications.routing';
import { PushNotificationsComponent } from '@pages/mobile/push-notifications/push-notifications.page';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    PushNotificationsComponent
  ],
  imports: [
    CommonModule,
    PushNotificationsRoutingModule,
    SharedModule
  ]
})
export class PushNotificationsModule { }
