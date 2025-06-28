import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestScreenRoutingModule } from './invest-screen.routing';
import { SharedModule } from '@shared/shared.module';
import { InvestScreenComponent } from '@pages/mobile/invest-screen/invest-screen.page';




@NgModule({
  declarations: [
    InvestScreenComponent
  ],
  imports: [
    CommonModule,
    InvestScreenRoutingModule,
    SharedModule
  ]
})
export class InvestScreenModule { }
