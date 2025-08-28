import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from "@modules/auth/auth.api";
import { GoogleIdentityService } from '@modules/auth/google-identity.service';
@Component({
  selector: "mdk-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./styles/auth.page.mobile.scss","./styles/auth.page.desktop.scss"],
  providers:[AuthApi,GoogleIdentityService]
})
export class AuthComponent {

  //#region [---- DEPENDENCIES ----]
  private readonly gis = inject(GoogleIdentityService);
  private readonly router = inject(Router);
  //#endregion

  //#region [---- PROPERTIES ----]


  //#endregion

  //#region [---- LIFE CYCLES ----]
  //#endregion

  //#region [---- LOGIC ----]

  async onGoogleClick(): Promise<void> {
    try {
      const isLogged = await this.gis.signInAndGetProfile();
      if(isLogged) this.router.navigate(['']);
      
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  }

  //#endregion
}
