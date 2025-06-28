import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFeature } from '@modules/web/feature-flags/models/interfaces/features-flags.interfaces';
import { FeatureFlagService } from '@modules/web/feature-flags/feature-flag.service';
import { PrimeNgModule } from '@shared/primeng/primeng.module';
import { WebModule } from '@modules/web/web.module';
import { FeatureItemComponent } from '@pages/web/features-flags/components/dumb/feature-item/feature-item.component';
import { FeatureCreateEditComponent } from '@pages/web/features-flags/components/dumb/feature-create-edit/feature-create-edit.component';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mdk-features-flags',
  standalone: true,
  imports: [CommonModule,FormsModule,PrimeNgModule,WebModule,FeatureItemComponent,FeatureCreateEditComponent],
  templateUrl: './features-flags.page.html',
  styleUrls: ['./features-flags.page.scss']
})
export class FeaturesFlagsComponent implements OnInit {

  private readonly featuresServices:FeatureFlagService = inject(FeatureFlagService)

  isProduction:boolean = environment.production

  features$: Observable<IFeature[]>
  searchInputValue:string;
  showCreateForm:boolean = false
  indexTrack:number;

  keyFeatureError:boolean = false


  ngOnInit(): void {
    if(this.featuresServices.enabledFirebase) this.features$ = this.featuresServices.getFeatures()
  }

  async create(feature:IFeature){
    if(!this.isProduction){
      try {
        await this.featuresServices.addFeature(feature)
        this.showCreateForm = false
      } catch (error) {
        this.keyFeatureError = true
        setTimeout(() => {
          this.keyFeatureError = false
        }, 5000);
      }
    }
  }

  async updateFeature(feature:IFeature){
      await this.featuresServices.updateFeature(feature)
      this.showCreateForm = false
      return
  }

  async deleteFeature(feature:IFeature):Promise<void>{
    if(!this.isProduction){
      await this.featuresServices.deleteFeature(feature)
    }
  }

  trackFeature(index: number, feature: IFeature): string {
    this.indexTrack = index;
    return feature.id;
  }








}
