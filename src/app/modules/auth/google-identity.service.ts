// All comments in English.
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare global {
  interface Window { google?: any; }
}

@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private clientId = environment.google.clientId;

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve();
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(s);
    });
  }

  async signIn(onCredential: (idToken: string) => void): Promise<void> {
    await this.loadScript();

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (resp: any) => {
        const idToken: string | undefined = resp?.credential;
        if (idToken) onCredential(idToken);
      },
      ux_mode: 'popup'
    });

    window.google.accounts.id.prompt();
  }

  disableAutoSelect(): void {
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  }
}
