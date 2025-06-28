import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '@shared/primeng/primeng.module';
import { IFeature } from '@modules/web/feature-flags/models/interfaces/features-flags.interfaces';

@Component({
  selector: 'mdk-feature-create-edit',
  standalone: true,
  imports: [CommonModule,FormsModule,PrimeNgModule],
  templateUrl: './feature-create-edit.component.html',
  styleUrls: ['./feature-create-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCreateEditComponent implements OnInit {

  @Input() showForm:boolean;
  @Input() feature:IFeature;
  @Input() showError:boolean;

  @Output() hideForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() create: EventEmitter<IFeature> = new EventEmitter<IFeature>();
  @Output() update: EventEmitter<IFeature> = new EventEmitter<IFeature>();

  tempFeature:IFeature = {
    id:'',
    name:'',
    key_feature:'',
    isEnabled:false
  }

  ngOnInit(): void {
    if(this.feature){
      this.tempFeature = {...this.feature}
    }
  }

  resetForm():void {
    this.tempFeature = {
      id:'',
      name:'',
      key_feature:'',
      isEnabled:false
    }
    this.hideForm.emit()
  }

  createFeature():void{
    this.create.emit(this.tempFeature)
  }
  updateFeature():void{
    this.update.emit(this.tempFeature)
  }
}
