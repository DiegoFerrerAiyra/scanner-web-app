import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { of, throwError } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Card as CardComponent } from "primeng/card";
import { findEl, setFieldValue } from "@core/testing/utils.utils";
import { click, submit } from "@core/testing/events.utils";
import { DeleteCardService } from "@modules/users/delete-card/delete-card.api";
import { DeleteCardComponent } from "../delete-card.page";
import { ErrorsManager } from "@core/errors/errors.manager";
import { HttpErrorResponse } from "@angular/common/http";
import { TOAST_SEVERITY_TYPES } from "@shared/primeng/constants/toast.constants";
import { CDescriptions } from "../models/constants/descriptions.contants";
import { SECOND } from "@shared/models/constants/time.constant";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ButtonDirective } from "primeng/button";

import { provideMockStore } from "@ngrx/store/testing";
import { SharedModule } from "@shared/shared.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe(DeleteCardComponent.name, () => {
  let component: DeleteCardComponent;
  let fixture: ComponentFixture<DeleteCardComponent>;

  let deleteCarServicedMock: jasmine.SpyObj<DeleteCardService>;
  let errorsManagerMock: jasmine.SpyObj<ErrorsManager>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCardComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [
        MessageService,
        ConfirmationService,
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

    deleteCarServicedMock = jasmine.createSpyObj('DeleteCardService', ['deleteCard', 'listCard']);
    errorsManagerMock = jasmine.createSpyObj('ErrorsManager', ['manageErrors']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.overrideComponent(DeleteCardComponent, {
      set: {
        providers: [
          {
            provide: DeleteCardService,
            useValue: deleteCarServicedMock
          },
          {
            provide: ErrorsManager,
            useValue: errorsManagerMock
          },           {
            provide: MessageService,
            useValue: messageServiceMock
          },
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCardComponent);
    component = fixture.componentInstance;

    fixture.autoDetectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fetch cards - user not found', (done: DoneFn) => {
    const errResponse = new HttpErrorResponse({
      error: 'test 400 error',
      status: 400,
      statusText: 'bad request',
    });

    deleteCarServicedMock.listCard.and.callFake(() => throwError(() => errResponse))
    
    const inputModakUserID = findEl<DeleteCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    submit(fixture, "form")

    expect(deleteCarServicedMock.listCard).toHaveBeenCalledOnceWith("test-user-uuid-123");
    
    expect(errorsManagerMock.manageErrors).toHaveBeenCalledOnceWith(errResponse);
  
    done();
  });

  it('fetch cards - user not has cards', (done: DoneFn) => {
    deleteCarServicedMock.listCard.and.callFake(() => of({ list_cards: [] }))

    const inputModakUserID = findEl<DeleteCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    submit(fixture, "form")

    expect(deleteCarServicedMock.listCard).toHaveBeenCalledOnceWith("test-user-uuid-123");

    expect(messageServiceMock.add).toHaveBeenCalledOnceWith({
      severity: TOAST_SEVERITY_TYPES.INFO,
      detail: CDescriptions.NO_CARDS,
      life: SECOND * 3
    })

    done();
  });

  it('fetch cards - user has one card', (done: DoneFn) => {
    deleteCarServicedMock.listCard.and.callFake(() => of({ 
      list_cards: [
        "card-id-123",
      ]
    }))

    const inputModakUserID = findEl<DeleteCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    submit(fixture, "form")

    expect(deleteCarServicedMock.listCard).toHaveBeenCalledOnceWith("test-user-uuid-123");

    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(By.directive(CardComponent))

    expect(cardElements.length).toBe(1)

    done();
  });

  it('fetch cards - user has many card', (done: DoneFn) => {
    deleteCarServicedMock.listCard.and.callFake(() => of({
      list_cards: [
        "card-id-123",
        "card-id-345",
        "card-id-567",
        "card-id-789",
      ]
    }))

    const inputModakUserID = findEl<DeleteCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    submit(fixture, "form")

    expect(deleteCarServicedMock.listCard).toHaveBeenCalledOnceWith("test-user-uuid-123");

    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(By.directive(CardComponent))

    expect(cardElements.length).toBe(4)

    done();
  });

  it('delete card - fail', (done: DoneFn) => {
    deleteCarServicedMock.listCard.and.callFake(() => of({
      list_cards: [
        "card-id-123",
        "card-id-456",
        "card-id-789",
      ]
    }));

    deleteCarServicedMock.deleteCard.and.callFake(() => of({
      id: "card-id",
      cardStatus: "deleted",
    }));

    const inputModakUserID = findEl<DeleteCardComponent>(fixture, "[formControlName=modakUserId]")
    setFieldValue(inputModakUserID, "test-user-uuid-123");

    submit(fixture, "form")

    expect(deleteCarServicedMock.listCard).toHaveBeenCalledOnceWith("test-user-uuid-123");

    fixture.detectChanges();

    click(fixture, '.pi.pi-trash');

    const allCards = fixture.debugElement.queryAll(By.directive(CardComponent));
    const [, middleCard] = allCards

    const button = middleCard.query(By.directive(ButtonDirective));

    button.nativeElement.click()

    fixture.detectChanges()

    const confirmDialogFixture = fixture.debugElement.query(By.directive(ConfirmDialog));

    const confirmDialog: ConfirmDialog = confirmDialogFixture.componentInstance;

    expect(confirmDialog._visible).toBeTrue();

    const acceptButton = confirmDialogFixture.query(By.css('button.p-confirm-dialog-accept'));

    acceptButton.nativeElement.click();

    expect(deleteCarServicedMock.deleteCard).toHaveBeenCalledOnceWith({
      modakUserId: "test-user-uuid-123",
      cardId: "card-id-456"
    });

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.directive(CardComponent)).length).toBeLessThan(allCards.length)
    expect(component.listCardsIds).toEqual(["card-id-123", "card-id-789"])

    done();
  });
})