import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './dumb/spinner/spinner.component';
import { PrimeNgModule } from '@shared/primeng/primeng.module';
import { ConfirmModalComponent } from './dumb/confirm-modal/confirm-modal.component';
import { CardInfoComponent } from './dumb/card-info/card-info.component';
import { FileUploadComponent } from './dumb/file-upload/file-upload.component';
import { CheckPermissionsByEmailComponent } from './dumb/check-permissions/check-permissions-by-email.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//MO CARDS
import { MoCardFacesComponent } from './dumb/mo-card-faces/mo-card-faces.component';
import { MoCardStickersComponent } from './dumb/mo-card-stickers/mo-card-stickers.component';
import { MoCardFlowComponent } from './dumb/mo-card-flow/mo-card-flow.component';
import { MoCardGoghComponent } from './dumb/mo-card-gogh/mo-card-gogh.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    ConfirmModalComponent,
    CardInfoComponent,
    FileUploadComponent,
    CheckPermissionsByEmailComponent,
    //MO CARDS
    MoCardFacesComponent,
    MoCardStickersComponent,
    MoCardFlowComponent,
    MoCardGoghComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    DirectivesModule,
    PipesModule,
    PrimeNgModule,
  ],
  exports:[
    SpinnerComponent,
    ConfirmModalComponent,
    CardInfoComponent,
    FileUploadComponent,
    CheckPermissionsByEmailComponent,
    //MO CARDS
    MoCardFacesComponent,
    MoCardStickersComponent,
    MoCardFlowComponent,
    MoCardGoghComponent,
  ]
})
export class ComponentsModule { }
