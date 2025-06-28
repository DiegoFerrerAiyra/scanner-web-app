import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { DeleteCardRoutingModule } from './delete-card.routing';
import { DeleteCardComponent } from '@pages/users/delete-card/delete-card.page';

@NgModule({
  declarations: [
    DeleteCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,

    DeleteCardRoutingModule,
  ]
})
export class DeleteCardModule { }
