import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[colorBySign]'
})
export class ColorBySignDirective implements OnChanges {
  @Input() colorBySign!: number | string | null;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnChanges(): void {
    if (this.colorBySign == null) return;

    const cleaned = this.colorBySign
      .toString()
      .replace('%', '')
      .replace(',', '.')
      .trim();

    const num = Number(cleaned);
    if (isNaN(num)) return;

    this.rd.removeClass(this.el.nativeElement, 'text-green-500');
    this.rd.removeClass(this.el.nativeElement, 'text-red-500');

    if (num > 0) {
      this.rd.addClass(this.el.nativeElement, 'text-green-500');
    } else if (num < 0) {
      this.rd.addClass(this.el.nativeElement, 'text-red-500');
    }
  }
}
