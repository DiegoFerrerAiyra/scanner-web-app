import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { INotificationPool } from '@modules/mobile/push-notifications/models/interfaces/notifications.interfaces';
import { environment } from 'src/environments/environment';

import { NotificationsApi } from '../push-notifications.api';


describe('AdminApi', () => {
  let service: NotificationsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(NotificationsApi);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Simulated send-notification', () => {
    const notifications : INotificationPool = {
      title:"title",
      message:"message"
    }

    service.sendPushNotifications(notifications).subscribe(response => {
      expect(response).toEqual("")
    })

    const req = httpMock.expectOne(`${environment.API_URL}/backoffice/notifications`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush("")
  })
});