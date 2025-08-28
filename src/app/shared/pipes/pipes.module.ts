import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByteToMegaBytePipe } from './byte-to-mega-byte.pipe';
import { NumberSuffixPipe } from './number-suffix.pipe';
import { DotToCommaPipe } from './dot-to-comma.pipe';



@NgModule({
  declarations: [
    ByteToMegaBytePipe,
    NumberSuffixPipe,
    DotToCommaPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ByteToMegaBytePipe,
    NumberSuffixPipe,
    DotToCommaPipe
  ]
})
export class PipesModule { }
