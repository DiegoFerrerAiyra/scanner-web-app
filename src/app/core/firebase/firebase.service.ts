import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ErrorsManager } from '@core/errors/errors.manager';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private readonly angularFireAuth: AngularFireAuth = inject(AngularFireAuth)
  private readonly errorManager: ErrorsManager = inject(ErrorsManager)
  private enabledFirebase:boolean = environment.firebase.enabled

  async login():Promise<void>{
    if(this.enabledFirebase){
      try {
        const {userApp,token} = environment.firebase
        await this.angularFireAuth.signInWithEmailAndPassword(userApp,token)
      } catch (error) {
        this.errorManager.manageErrors(error)
      }
    }
  }
}
