import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReplaceCardRoutingModule } from './replace-card.routing';
import { ReplaceCardComponent } from '@pages/users/replace-card/replace-card.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    ReplaceCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    ReplaceCardRoutingModule,
  ]
})
export class ReplaceCardModule { }
