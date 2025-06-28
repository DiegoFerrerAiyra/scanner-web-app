import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { TransfersApi } from '../transfers.api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ITransferToModakResponse, ITransferToUserResponse } from '../models/interfaces/transfers.interface';

describe('TransfersService', () => {
  let service: TransfersApi;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransfersApi, provideMockStore()],
    });
    service = TestBed.inject(TransfersApi);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('failed transfer to modak', (done: DoneFn) => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent("API error")

    let actualError: HttpErrorResponse | undefined;

    service.transferFromUserToModak({ amount: "10", userId: "user-uuid-123", description: "" }).subscribe({
      error: err => actualError = err,
    });

    const expectedUrl = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_modak`;

    controller.expectOne(expectedUrl).error(
      errorEvent,
      { status, statusText }
    )

    controller.verify();

    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);

    done()
  });

  it('success transfer to modak', (done: DoneFn) => {
    const status = 204;
    const statusText = 'No Content';

    let expected: ITransferToModakResponse = { transfer_id: "transaction-uuid" }

    service.transferFromUserToModak({ amount: "10", userId: "user-uuid-123", description: "" }).subscribe({
      next: res => {
        expect(res).toEqual(expected);
        done()
      }
    });

    const expectedUrl = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_modak`;

    const request = controller.expectOne({
      url: expectedUrl,
      method: 'POST',
    })

    request.flush({ transfer_id: "transaction-uuid" }, { status, statusText, headers: new HttpHeaders().append('Accept', 'application/json') })

    controller.verify();
  });

  it('failed transfer to user', (done: DoneFn) => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent("API error")

    service.transferFromModakToUser({ amount: "10", modakUserId: "user-uuid-123", description: "" }).subscribe({
      error: (err: HttpErrorResponse) => {

        expect(err.error).toBe(errorEvent);
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);

        done()
      },
    });

    const expectedUrl = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_user`;

    controller.expectOne(expectedUrl).error(
      errorEvent,
      { status, statusText }
    )

    controller.verify();
  });

  it('success transfer to user', (done: DoneFn) => {
    const status = 200;
    const statusText = 'No Content';

    let expected: ITransferToUserResponse = { transfer_id: "transaction-uuid" }

    service.transferFromModakToUser({ amount: "10", modakUserId: "user-uuid-123", description: "" }).subscribe({
      next: res => {
        expect(res).toEqual(expected);
        done()
      }
    });

    const expectedUrl = `${environment.APIS.BANKING_DOMAIN_URL}/backoffice/v1/transfer_to_user`;

    const request = controller.expectOne({
      url: expectedUrl,
      method: 'POST',
    })

    request.flush({ transfer_id: "transaction-uuid" }, { status, statusText })

    controller.verify();
  });
});
