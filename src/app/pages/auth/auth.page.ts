import { Component, inject, OnInit } from '@angular/core';
import { AuthApi } from "@modules/auth/auth.api";
import { Location } from '@angular/common';
import { GoogleIdentityService } from '@modules/auth/google-identity.service';
@Component({
  selector: "mdk-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./styles/auth.page.mobile.scss","./styles/auth.page.desktop.scss"],
  providers:[AuthApi,GoogleIdentityService]
})
export class AuthComponent implements OnInit {

  //#region [---- DEPENDENCIES ----]
  private readonly loc:Location = inject(Location)
  private readonly gis = inject(GoogleIdentityService);
  //#endregion

  //#region [---- PROPERTIES ----]

  public loginTempCode:string;

  //#endregion

  //#region [---- LIFE CYCLES ----]

  ngOnInit() {}
  //#endregion

  //#region [---- LOGIC ----]

  async onGoogleClick(): Promise<void> {
    await this.gis.signIn((idToken: string) => {
      // At this point you have the Google ID Token (JWT).
      // From here on, YOU handle everything (NgRx, persistence, guards, navigation, etc).
      console.log('Google ID Token (JWT):', idToken);
    });
  }

  //#endregion
}
