// All comments in English.
import { inject, Injectable } from '@angular/core';
import { GlobalState } from '@core/global-state/app.state';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { authActions } from './state/authentication.actions';
import { IUser } from './models/interfaces/auth.interfaces';

declare global {
  interface Window { google?: any; }
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {


  //#region [---- DEPENDENCIES ----]
  private readonly store = inject(Store<GlobalState>);
  //#endregion

  private clientId = environment.google.clientId;
  private tokenClient: any | null = null;

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) return resolve();
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(s);
    });
  }

  /**
   * Opens a popup, requests access_token (openid email profile),
   * then calls the UserInfo endpoint and returns the profile.
   */
  async signInAndGetProfile(): Promise<Boolean> {
    await this.loadScript();

    const accessToken: string = await new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'openid email profile',
          // Use 'consent' to always show the popup (good for first time / testing).
          prompt: 'consent',
          callback: (resp: any) => {
            const at = resp?.access_token;
            if (at) return resolve(at);
            return reject(new Error(resp?.error || 'No access_token received'));
          },
        });
      }
      this.tokenClient.requestAccessToken();
    });

    // Fetch user profile
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`UserInfo failed: ${res.status}`);
    const profile = (await res.json()) as GoogleUserProfile;
    
    const user:IUser = {
      name: profile.name,
      email: profile.email,
      accessToken: accessToken,
      refreshToken: '',
      picture: profile.picture,
      roles: []
    }

    this.store.dispatch(authActions.setUser({authentication:user}))

    return true;
  }

  /**
   * Optional: revoke token (logout-like).
   */
  async revokeAll(): Promise<void> {
    try {
      await this.loadScript();
      // There is no direct revoke for access_token from GIS Token Flow,
      // but we can disable auto-select on ID API and clear local app session.
      window.google?.accounts?.id?.disableAutoSelect?.();
    } catch { /* no-op */ }
  }
}
