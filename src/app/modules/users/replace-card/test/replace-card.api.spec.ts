import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ReplaceCardService } from '../replace-card.api';
import { ReplaceCardPayload } from '@pages/users/replace-card/models/interfaces/form.interface';
import { environment } from 'src/environments/environment';
import { ICardReplaceResponse } from '../models/interface/response.interface';

describe('ReplaceCardService', () => {
  let service: ReplaceCardService;
  let httpTestingController: HttpTestingController;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ReplaceCardService,
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(ReplaceCardService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('failed calling API', (done: DoneFn) => {
    const url = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/card/replace`
    httpClientSpy.post.withArgs(url, {
      cardholder_user_id: "modak-user-id-1",
      card_id: "card-id-1",
      reason: "reason",
    });
  
    expect(service).toBeTruthy();

    const body: ReplaceCardPayload = {
      cardId: "card-id-1",
      modakUserId: "modak-user-id-1",
      reason: "reason"
    }

    service.replaceCard(body).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.message).toContain('bad request');
        expect(error.status).toBe(400);
        done()
      }
    });

    const errorResponse = new HttpErrorResponse({
      error: 'test 400 error',
      status: 400,
      statusText: 'bad request',
    });

    const testRequest = httpTestingController.expectOne(url);
    testRequest.flush('error', errorResponse);
  });

  it('success calling API', (done: DoneFn) => {
    const url = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/card/replace`
    httpClientSpy.post.withArgs(url, {
      cardholder_user_id: "modak-user-id-1",
      card_id: "card-id-1",
      reason: "reason",
    });

    expect(service).toBeTruthy();

    const body: ReplaceCardPayload = {
      cardId: "card-id-1",
      modakUserId: "modak-user-id-1",
      reason: "reason"
    }

    service.replaceCard(body).subscribe({
      next: (res:ICardReplaceResponse) => {
        expect(res.card_id).toBe("new_card_uuid")
        done()
      }
    });

    const testRequest = httpTestingController.expectOne(url);
    testRequest.flush({ card_id:"new_card_uuid" });
  });
});
