import { Pipe, PipeTransform } from '@angular/core';
import { IFeature } from '@modules/web/feature-flags/models/interfaces/features-flags.interfaces';

@Pipe({
  name: 'searchFeature'
})
export class SearchFeaturePipe implements PipeTransform {

  transform(features: IFeature[],keySearch:string): IFeature[] {
    if(!keySearch) return features
    return features.filter(feature => feature.name.toUpperCase().startsWith(keySearch.toUpperCase()))
  }

}
