import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotToComma'
})
export class DotToCommaPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value == null) return '';
    return value.toString().replace('.', ',');
  }

}
