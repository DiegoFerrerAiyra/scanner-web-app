import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteToMegaByte'
})
export class ByteToMegaBytePipe implements PipeTransform {

  transform(bytes:number): number {
    return (bytes / 1024) / 1024
  }

}
