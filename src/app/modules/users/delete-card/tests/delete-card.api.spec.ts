import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDeleteCardPayload, IDeleteCardResponse } from '../models/interfaces/delete-card.interface';
import { DeleteCardService } from '../delete-card.api';

describe('DeleteCardService', () => {
  let service: DeleteCardService;
  let httpTestingController: HttpTestingController;
  let httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [DeleteCardService]
    });
    service = TestBed.inject(DeleteCardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('failed calling API', (done: DoneFn) => {
    const url = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/card/delete`
    httpClientSpy.post.withArgs(url, {
      user_id: "modak-user-id-1",
      card_id: "card-id-1",
    });

    expect(service).toBeTruthy();

    const body: IDeleteCardPayload = {
      modakUserId: "modak-user-id-1",
      cardId: "card-id-1",
    }

    service.deleteCard(body).subscribe({
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
    const url = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/card/delete`
    httpClientSpy.post.withArgs(url, {
      cardholder_user_id: "modak-user-id-1",
      card_id: "card-id-1",
    });

    expect(service).toBeTruthy();

    const body: IDeleteCardPayload = {
      cardId: "card-id-1",
      modakUserId: "modak-user-id-1",
    }

    service.deleteCard(body).subscribe({
      next: (res: IDeleteCardResponse) => {
        expect(res.cardStatus).toBe("deleted")
        done()
      }
    });

    const testRequest = httpTestingController.expectOne(url);
    testRequest.flush({ cardStatus: "deleted" });
  });
});
