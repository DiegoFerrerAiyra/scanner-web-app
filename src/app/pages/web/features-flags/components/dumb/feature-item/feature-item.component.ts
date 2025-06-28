import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '@shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { IFeature } from '@modules/web/feature-flags/models/interfaces/features-flags.interfaces';
import { FeatureCreateEditComponent } from '../feature-create-edit/feature-create-edit.component'
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mdk-feature-item',
  standalone: true,
  imports: [CommonModule,PrimeNgModule,FormsModule,FeatureCreateEditComponent],
  templateUrl: './feature-item.component.html',
  styleUrls: ['./feature-item.component.scss'],
  providers:[ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureItemComponent {

  private readonly confirmationService:ConfirmationService = inject(ConfirmationService)

  @Input() feature:IFeature;
  @Output() update: EventEmitter<IFeature> = new EventEmitter<IFeature>();
  @Output() delete: EventEmitter<IFeature> = new EventEmitter<IFeature>();

  showEditForm:boolean = false
  isProduction:boolean = environment.production

  updateForSwitch(){
    this.update.emit(this.feature)
  }

  updateFeatureForm(feature:IFeature){
    this.update.emit(feature)
  }

  deleteConfirm() {
    this.confirmationService.confirm({
        key: 'delete',
        message: `Are you sure to delete the feature: ${this.feature?.name}`,
        accept: () => this.deleteFeature(),
    });
  }

  deleteFeature():void{
    this.delete.emit(this.feature)
  }

  editButton():void{
    this.showEditForm = true
  }
}
