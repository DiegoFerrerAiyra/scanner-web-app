import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web.routing';
import { SearchFeaturePipe } from './feature-flags/pipes/search-feature.pipe';


@NgModule({
  imports: [
    CommonModule,
    WebRoutingModule,
  ],
  declarations: [
    SearchFeaturePipe
  ],
  exports:[
    SearchFeaturePipe
  ]
})
export class WebModule { }
