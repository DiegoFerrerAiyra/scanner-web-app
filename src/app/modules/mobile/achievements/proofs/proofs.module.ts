import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProofsRoutingModule } from './proofs.routing';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ProofsComponent } from '@pages/mobile/achievements/sub-pages/proofs/proofs.page';

@NgModule({
  declarations: [
    ProofsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProofsRoutingModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ProofsModule { }
