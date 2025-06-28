import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { TransferComponent } from '@pages/transfer/transfer.component';

import { TransfersRoutingModule } from './transfer.routing';

@NgModule({
  declarations: [TransferComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    TransfersRoutingModule,
  ],
})
export class TransfersModule { }
