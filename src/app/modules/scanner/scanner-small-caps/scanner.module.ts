import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner.routing';
import { ScannerComponent } from '@pages/scanner/scanner-small-caps/scanner.page';
import { SharedModule } from '@shared/shared.module';
import { RolesModule } from '@core/roles/roles.module';



@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    ScannerRoutingModule,
    SharedModule,
    RolesModule
  ],
  providers:[]
})
export class ScannerSmallCapsModule { }
