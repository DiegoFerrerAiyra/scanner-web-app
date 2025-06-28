import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users.routing';
import { UsersComponent } from '@pages/users/search-users/users.page';
import { SharedModule } from '@shared/shared.module';
import { RolesModule } from '@core/roles/roles.module';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    RolesModule
  ]
})
export class SearchUsersModule { }
