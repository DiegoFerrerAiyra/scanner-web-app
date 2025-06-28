import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReplaceCardComponent } from '../replace-card.page'; 
import { ReplaceCardService } from '@modules/users/replace-card/replace-card.api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { findEl, setFieldValue } from '@core/testing/utils.utils';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ReplaceCardPayload } from '../models/interfaces/form.interface';
import { submit } from '@core/testing/events.utils';
import { setValueDropdown } from '@core/testing/primeng.uttils';
import { ICardReplaceResponse } from '@modules/users/replace-card/models/interface/response.interface';
import { CDescriptions } from '../models/constants/descriptions.contants';
import { TOAST_SEVERITY_TYPES } from '@shared/primeng/constants/toast.constants';
import { ClipboardService } from 'ngx-clipboard';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';

describe('ReplaceCardComponent', () => {
  let component: ReplaceCardComponent;
  let fixture: ComponentFixture<ReplaceCardComponent>;
  let replaceCardMock: jasmine.SpyObj<ReplaceCardService>;
  let errorsManagerMock: jasmine.SpyObj<ErrorsManager>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let clipboardServiceMock: jasmine.SpyObj<ClipboardService>;

  beforeEach(async () => {
    replaceCardMock = jasmine.createSpyObj('ReplaceCardService', ['replaceCard']);
    errorsManagerMock = jasmine.createSpyObj('ErrorsManager', ['manageErrors']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    clipboardServiceMock = jasmine.createSpyObj('ClipboardService', ['copy']);

    await TestBed.configureTestingModule({
      declarations: [
        ReplaceCardComponent,
      ],
      imports: [
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [
        MessageService,
        ErrorsManager,
        ReplaceCardService,
        ClipboardService,
        provideMockStore({
          initialState: {
            authentication: {
              user: {
                email: 'test@modak.live'
              }
            }
          }
        }),
      ],
    }).compileComponents();

    await TestBed.overrideComponent(ReplaceCardComponent, {
      set: {
        providers: [
          {
            provide: ReplaceCardService,
            useValue: replaceCardMock
          },
          {
            provide: ErrorsManager,
            useValue: errorsManagerMock
          },
          {
            provide: MessageService,
            useValue: messageServiceMock
          },
          {
            provide: ClipboardService,
            useValue: clipboardServiceMock,
          }
        ],
      },
    });

    fixture = TestBed.createComponent(ReplaceCardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('failed replace card', (done:DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 400 error',
      status: 400,
      statusText: 'bad request',
    });

    replaceCardMock.replaceCard.and.callFake(() => {
      return throwError(() => errorResponse);
    });

    const inputModakUserID = findEl<ReplaceCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    const inputCardID = findEl<ReplaceCardComponent>(fixture, "[formControlName=cardId]")
    setFieldValue(inputCardID, "test-card-id")

    setValueDropdown(fixture, "lost", "lost")

    submit(fixture, "form")
  
    const input: ReplaceCardPayload = {
      modakUserId: "test-user-uuid-123",
      cardId: "test-card-id",
      reason: "lost"
    }

    expect(replaceCardMock.replaceCard).toHaveBeenCalledOnceWith(input)
    expect(errorsManagerMock.manageErrors).toHaveBeenCalledOnceWith(errorResponse)

    done()
  }); 

  it('success replace card', (done: DoneFn) => {
    const response: ICardReplaceResponse = {
      card_id: "new_card_id"
    }

    replaceCardMock.replaceCard.and.callFake(() => {
      return of(response)
    });

    const inputModakUserID = findEl<ReplaceCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    const inputCardID = findEl<ReplaceCardComponent>(fixture, "[formControlName=cardId]")
    setFieldValue(inputCardID, "test-card-id")

    setValueDropdown(fixture, "lost", "lost")

    submit(fixture, "form")

    const input: ReplaceCardPayload = {
      cardId: "test-card-id",
      modakUserId: "test-user-uuid-123",
      reason: "lost"
    }
    replaceCardMock.replaceCard.withArgs(input)

    expect(replaceCardMock.replaceCard).toHaveBeenCalledOnceWith(input)
    expect(messageServiceMock.add).toHaveBeenCalledOnceWith({
      closable: true,
      severity: TOAST_SEVERITY_TYPES.SUCCESS,
      detail: CDescriptions.SUCCESS_DETAILS,
    })

    done()
  });
});
