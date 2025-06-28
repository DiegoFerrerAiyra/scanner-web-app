import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByteToMegaBytePipe } from './byte-to-mega-byte.pipe';



@NgModule({
  declarations: [
    ByteToMegaBytePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ByteToMegaBytePipe
  ]
})
export class PipesModule { }
