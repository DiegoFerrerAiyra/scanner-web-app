import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdk-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() interceptor:boolean = false
  @Input() manual:boolean = false
  @Input() inputMessage:boolean = false
}
