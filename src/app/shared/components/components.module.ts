import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './dumb/spinner/spinner.component';
import { PrimeNgModule } from '@shared/primeng/primeng.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    DirectivesModule,
    PipesModule,
    PrimeNgModule,
  ],
  exports:[
    SpinnerComponent,
  ]
})
export class ComponentsModule { }
