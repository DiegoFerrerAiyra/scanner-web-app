import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mdk-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CardInfoComponent {
  @Input() title!: string;
  @Input() messages!: string[];
  @Input() fullWidth!: boolean;
  @Input() iconClass:string = "pi-info-circle";
  @Input() colorPastelClass:string = "pastelD";
  @Input() colorClass:string = "accentD"
}
