import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private readonly loc:Location = inject(Location)
  private readonly localhost: string = 'localhost'

  public getHostName():string{
    const angularRoute = this.loc.path();
    const url = window.location.href;
    const domainAndApp = url?.replace(angularRoute, '');
    return domainAndApp
  }

  public isLocalhost(): boolean {
    return this.getHostName().includes(this.localhost)
  }
}
