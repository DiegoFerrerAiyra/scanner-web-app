import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { AuthService } from '@modules/auth/auth.service';
import { CollectionsFeatureFirebase } from '@modules/web/feature-flags/models/constants/features-flags.constants';
import { IFeature } from '@modules/web/feature-flags/models/interfaces/features-flags.interfaces';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { first, forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {

  public enabledFirebase:boolean = environment.firebase.enabled
  private readonly firestore:Firestore = inject(Firestore)
  private readonly authService:AuthService = inject(AuthService)
  private collectionName = environment.production ? CollectionsFeatureFirebase.PROD : CollectionsFeatureFirebase.DEV

  //#region [---- CRUD FIREBASE ----]

  getFeatures():Observable<IFeature[]>{
    const featureRef = collection(this.firestore,this.collectionName)
    const featuresData =  collectionData(featureRef,{idField:'id'}) as Observable<IFeature[]>
    return featuresData.pipe(
      map(features => features.sort((previous, current) => previous.name.localeCompare(current.name)))
    )
  }

  async addFeature(feature: IFeature) {
    const existFeature = await this.featureExists(feature.key_feature);

    if (existFeature) {
      throw new Error();
    } else {
      const featureRefProd = collection(this.firestore, CollectionsFeatureFirebase.PROD);
      const featureRefDev = collection(this.firestore, CollectionsFeatureFirebase.DEV);
      const addProd = addDoc(featureRefProd, feature);
      const addDev = addDoc(featureRefDev, feature);

      return forkJoin([addProd, addDev]);
    }
  }

  async updateFeature(feature: IFeature):Promise<void> {
    const featureDocRef = doc(this.firestore,`${this.collectionName}/${feature.id}`)
    const featureToUpdate: Partial<IFeature> = {
      name: feature.name,
      isEnabled: feature.isEnabled,
      key_feature: feature.key_feature
    };
    await updateDoc(featureDocRef,featureToUpdate)
  }
  async deleteFeature(feature:IFeature):Promise<void>{
    const featureDocRef = doc(this.firestore,`${this.collectionName}/${feature.id}`)
    await deleteDoc(featureDocRef)
  }

  //#endregion

  //#region [---- METHODS ----]

  async featureExists(keyFeature: string): Promise<boolean> {
    const featureRef = collection(this.firestore, this.collectionName);

    const q = query(featureRef, where('key_feature', '==', keyFeature));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  userAllowedForFeatureFlags(): Observable<boolean> {
    return this.authService.getUserFromStore().pipe(
      map(user => {
        const usersAllowed = environment.firebase.usersAllowed
        return usersAllowed.some(email => email === user.email);
      }),
      first()
    );
  }

  //#endregion

}
