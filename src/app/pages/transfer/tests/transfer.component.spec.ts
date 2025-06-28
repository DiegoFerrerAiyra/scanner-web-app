import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { TransfersApi } from '@modules/transfers/transfers.api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { TransferComponent } from '../transfer.component';
import { findEl, setFieldValue } from '@core/testing/utils.utils';
import { submit } from '@core/testing/events.utils';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { CDescriptions } from '../models/constants/transfer.constants';

import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';

xdescribe(TransferComponent.name, () => {
  let component: TransferComponent;
  let fixture: ComponentFixture<TransferComponent>;

  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let errorManagerServiceMock: jasmine.SpyObj<ErrorsManager>;
  let transferServiceMock: jasmine.SpyObj<TransfersApi>;


  beforeEach(async () => {
    transferServiceMock = jasmine.createSpyObj('TransfersApi', ['transferFromUserToModak', 'transferFromModakToUser']);
    errorManagerServiceMock = jasmine.createSpyObj('ErrorsManager', ['manageErrors']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [TransferComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [
        TransfersApi,
        MessageService,
        ErrorsManager,
        provideMockStore({
          initialState: {
            authentication: {
              user: {
                email: 'test@modak.live'
              }
            }
          }
        }),
      ]
    }).compileComponents();

    await TestBed.overrideComponent(TransferComponent, {
      set: {
        providers: [
          { provide: TransfersApi, useValue: transferServiceMock },
          { provide: MessageService, useValue: messageServiceMock },
          { provide: ErrorsManager, useValue: errorManagerServiceMock },
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('transfer to modak - fail', (done: DoneFn) => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'bad request'
    });

    transferServiceMock.transferFromUserToModak.and.callFake(() => throwError(() => httpErrorResponse))

    const optionModak = findEl(fixture, '[aria-labelledby=MODAK]')
    expect(optionModak).toBeTruthy();

    optionModak.nativeElement.click();

    const inputModakUserID = findEl(fixture, "[formControlName=userId]")
    setFieldValue(inputModakUserID, "user-uuid-123");
    
    const inputAmount = findEl(fixture, "[formControlName=amount]")
    setFieldValue(inputAmount, "10");

    submit(fixture, "form");

    expect(transferServiceMock.transferFromUserToModak).toHaveBeenCalledOnceWith({
      amount: "10",
      userId: "user-uuid-123",
      description: '',
    });

    expect(errorManagerServiceMock.manageErrors).toHaveBeenCalledOnceWith(httpErrorResponse)

    done();
  });

  it('transfer to modak - success', (done: DoneFn) => {
    transferServiceMock.transferFromUserToModak.and.callFake(() => of({ transfer_id: "uuid-fake-123" }));

    const optionModak = findEl(fixture, '[aria-labelledby=MODAK]')
    expect(optionModak).toBeTruthy();

    optionModak.nativeElement.click()

    const inputModakUserID = findEl(fixture, "[formControlName=userId]")
    setFieldValue(inputModakUserID, "user-uuid-123");

    const inputAmount = findEl(fixture, "[formControlName=amount]")
    setFieldValue(inputAmount, "10");

    submit(fixture, "form");

    expect(transferServiceMock.transferFromUserToModak).toHaveBeenCalledOnceWith({
      amount: "10",
      userId: "user-uuid-123",
      description: '',
    });

    expect(messageServiceMock.add).toHaveBeenCalledOnceWith({
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptions.SUCCESS_TRANSFER
    });

    done();
  });
  

  it('transfer to user - fail', (done: DoneFn) => {
    const httpErrorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'bad request'
    });

    transferServiceMock.transferFromModakToUser.and.callFake(() => throwError(() => httpErrorResponse));

    const optionModak = findEl(fixture, '[aria-labelledby=USER]')
    expect(optionModak).toBeTruthy();

    optionModak.nativeElement.click();

    const inputModakUserID = findEl(fixture, "[formControlName=userId]")
    setFieldValue(inputModakUserID, "user-uuid-123");

    const inputAmount = findEl(fixture, "[formControlName=amount]")
    setFieldValue(inputAmount, "10");

    submit(fixture, "form");
 
    expect(transferServiceMock.transferFromModakToUser).toHaveBeenCalledOnceWith({
      amount: "10",
      modakUserId: "user-uuid-123",
      description: '',
    });

    expect(errorManagerServiceMock.manageErrors).toHaveBeenCalledOnceWith(httpErrorResponse)

    done();
  });

  it('transfer to user - success', (done: DoneFn) => {
    transferServiceMock.transferFromModakToUser.and.callFake(() => of({ transfer_id: "uuid-fake-123" }));

    const optionModak = findEl(fixture, '[aria-labelledby=USER]')
    expect(optionModak).toBeTruthy();

    optionModak.nativeElement.click()

    const inputModakUserID = findEl(fixture, "[formControlName=userId]")
    setFieldValue(inputModakUserID, "user-uuid-123");

    const inputAmount = findEl(fixture, "[formControlName=amount]")
    setFieldValue(inputAmount, "10");

    submit(fixture, "form");

    expect(transferServiceMock.transferFromModakToUser).toHaveBeenCalledOnceWith({
      amount: "10",
      modakUserId: "user-uuid-123",
      description: '',
    });

    expect(messageServiceMock.add).toHaveBeenCalledOnceWith({
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptions.SUCCESS_TRANSFER
    });

    done();
  });
});
