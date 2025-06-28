import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotificationPool } from '@modules/mobile/push-notifications/models/interfaces/notifications.interfaces';



@Injectable({
  providedIn: 'root'
})
export class NotificationsApi {

  private readonly http:HttpClient = inject(HttpClient)
  private BASE_URL: string = environment.API_URL;

  sendPushNotifications(notifications: INotificationPool) : Observable<string> {
    return this.http.post<string>(`${this.BASE_URL}/backoffice/notifications`, notifications)
  }
}


