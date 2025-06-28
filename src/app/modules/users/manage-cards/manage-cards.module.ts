import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageCardsRoutingModule } from './manage-cards.routing';
import { ManageCardsComponent } from '@pages/users/manage-cards/manage-cards.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    ManageCardsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageCardsRoutingModule,

    SharedModule,
  ],
})
export class ManageCardsModule { }
