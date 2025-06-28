import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MintRoutingModule } from './mint.routing';
import { MintComponent } from '@pages/users/mint/mint.page';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    MintComponent
  ],
  imports: [
    CommonModule,
    MintRoutingModule,
    SharedModule
  ]
})
export class MintModule { }
