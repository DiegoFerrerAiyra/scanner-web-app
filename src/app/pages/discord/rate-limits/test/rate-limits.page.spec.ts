import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';

import { RateLimitsApi } from '../../../../modules/discord/rate-limits/rate-limits.api';

import { RateLimitsComponent } from '../rate-limits.page';
import { IntervalType } from '../../../../modules/discord/rate-limits/models/constants/rate-limit.constants';
import { environment } from 'src/environments/environment';
import { DateFunctions } from '@shared/utils/date.functions';
import { RecordStatus } from '@modules/discord/rate-limits/models/interface/rate-limit.interface';

describe('RateLimitsComponent', () => {
  let component: RateLimitsComponent;
  let fixture: ComponentFixture<RateLimitsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [DateFunctions, MessageService, ConfirmationService, RateLimitsApi],
      declarations: [ RateLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitted is false', () => {
    expect(component.submitted).toBeFalsy();
  });

  it('rate limit relative', () => {
    component.openNew()
    component.selectedStatus = RecordStatus.INACTIVE
    component.selectedIntervalType = IntervalType.RELATIVE;
    component.save();
    const rateLimit = component.rateLimit
    expect(component.submitted).toBeTruthy();
    expect(rateLimit.interval.is_relative).toBeTruthy();
    expect(rateLimit.interval.relative).toBeDefined();
  });

  it('rate limit absolute', () => {
    component.openNew()
    component.selectedStatus = RecordStatus.INACTIVE
    component.selectedIntervalType = IntervalType.ABSOLUTE;
    component.save();
    const rateLimit = component.rateLimit
    expect(component.submitted).toBeTruthy();
    expect(rateLimit.interval.is_relative).toBeFalsy();
    expect(Object.keys(rateLimit.interval.absolute).length).toBe(2);
  });

  it('rate limit get', () => {
    //verify if service was called
    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits`);
    expect(req.request.method).toBe('GET');

  });

  it('rate limit save', () => {
    const putItemSpy = spyOn(component, "putItem").and.callThrough();

    component.openNew()
    component.selectedStatus = RecordStatus.INACTIVE
    component.selectedIntervalType = IntervalType.ABSOLUTE;

    component.rateLimit.name = "Rate Limit Name";
    
    component.save();

    expect(putItemSpy).toHaveBeenCalled()

    //verify if service was called
    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/`);
    expect(req.request.method).toBe('POST');

  });

  it('rate limit update', () => {
    const putItemSpy = spyOn(component, "updateItem").and.callThrough();

    component.openNew()
    component.selectedStatus = RecordStatus.INACTIVE
    component.selectedIntervalType = IntervalType.ABSOLUTE;

    component.rateLimit.name = "Rate Limit Name";
    component.rateLimit.uuid = "Rate-Limit-UUID";
    
    component.save();

    expect(putItemSpy).toHaveBeenCalled()

    //verify if service was called
    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/${component.rateLimit.uuid}`);
    expect(req.request.method).toBe('PUT');

  });
});
