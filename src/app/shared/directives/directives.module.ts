import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '@core/roles/has-role.directive';
import { ColorBySignDirective } from './color-by-sign.directive';

const directives = [
  // HasRoleDirective
  ColorBySignDirective
]

@NgModule({
  imports: [CommonModule],
  declarations: [...directives],
  exports: [...directives]
})
export class DirectivesModule { }
