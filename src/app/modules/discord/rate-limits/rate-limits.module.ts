import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateLimitsRoutingModule } from './rate-limits.routing';


import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';
import { RateLimitsApi } from './rate-limits.api';
import { RateLimitsComponent } from '@pages/discord/rate-limits/rate-limits.page';

@NgModule({
  declarations: [
    RateLimitsComponent
  ],
  imports: [
    CommonModule,
    RateLimitsRoutingModule,
    SharedModule,
  ],
  providers: [MessageService, ConfirmationService, RateLimitsApi]
})
export class RateLimitsModule { }
