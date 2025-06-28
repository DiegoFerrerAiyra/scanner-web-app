import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppFunctions {
  private readonly localhost: string = 'localhost'
  private readonly localhostDns: string = 'local.dev.modakmakers.com'

  constructor(private loc: Location) { }

  getHostName():string{
    const angularRoute = this.loc.path();
    const url = window.location.href;
    const domainAndApp = url.replace(angularRoute, '');
    return domainAndApp
  }

  public isLocalhost(): boolean {
    return this.getHostName().includes(this.localhost) || this.getHostName().includes(this.localhostDns);
  }
}
