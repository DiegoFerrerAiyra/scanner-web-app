import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from './pipes/pipes.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PrimeNgModule } from './primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
