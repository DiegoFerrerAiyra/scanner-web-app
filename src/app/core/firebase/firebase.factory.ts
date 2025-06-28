import { FirebaseService } from "@core/firebase/firebase.service";

export const firebaseFactory = (firebaseService:FirebaseService) => () => firebaseService.login()