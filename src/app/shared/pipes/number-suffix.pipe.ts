// src/app/pipes/number-suffix.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberSuffix' })
export class NumberSuffixPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value as any)) return '';

    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);

    // Format helper: 0 decimals if >= 10 in the current unit, else 1 decimal.
    const fmt = (n: number): string => (n >= 10 ? Math.round(n).toString() : n.toFixed(1));

    // Trillions
    if (abs >= 1_000_000_000_000) {
      return sign + fmt(abs / 1_000_000_000_000) + 'T';
    }
    // Billions
    if (abs >= 1_000_000_000) {
      return sign + fmt(abs / 1_000_000_000) + 'B';
    }
    // Millions
    if (abs >= 1_000_000) {
      return sign + fmt(abs / 1_000_000) + 'M';
    }
    // Thousands
    if (abs >= 1_000) {
      return sign + fmt(abs / 1_000) + 'K';
    }
    // Units
    return sign + abs.toString();
  }
}
