import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { RateLimitsApi } from '../rate-limits.api';
import { environment } from 'src/environments/environment';
import { IRateLimit } from '@modules/discord/rate-limits/models/interface/rate-limit.interface';

describe('RateLimitsApi', () => {
  let httpMock: HttpTestingController;
  let service: RateLimitsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [
        RateLimitsApi
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController)
    service = TestBed.inject(RateLimitsApi);
  })

  afterEach(() => { 
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpMock).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it("Simulated getRateLimits service method", () => {
    const dateString = new Date().toString()
    const modckResponse: IRateLimit[] = [
      {
        uuid:"TEST-RATE-LIMIT",
        name: "test",
        limit_calls:1,
        interval:{
          is_relative:false,
          relative: 1,   
          absolute:{
            start:dateString,
            end:dateString
          }
        },
        inactive: true,
        created: dateString,
        updated: dateString,
        status: "active"
      }
    ];

    service.getRateLimits().subscribe(rateLimit => {
      expect(rateLimit).toEqual(modckResponse);
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(modckResponse)
  });

  it("Simulated getRateLimit service by id method", () => {
    const dateString = new Date().toString()
    const modckResponse: IRateLimit = {
      uuid:"TEST-RATE-LIMIT",
      name: "test",
      limit_calls:1,
      interval:{
        is_relative:false,
        relative: 1,   
        absolute:{
          start:dateString,
          end:dateString
        }
      },
      inactive: true,
      created: dateString,
      updated: dateString,
      status: "active"
    }

    service.getRateLimit("TEST-RATE-LIMIT").subscribe(rateLimit => {
      expect(rateLimit).toEqual(modckResponse);
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/${modckResponse.uuid}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(modckResponse)
  });

  it("Simulated createRateLimit method", () => {
    const dateString = new Date().toString()
    const modckPayload: IRateLimit = {
      uuid:"TEST-RATE-LIMIT",
      name: "test",
      limit_calls:1,
      interval:{
        is_relative:false,
        relative: 1,   
        absolute:{
          start:dateString,
          end:dateString
        }
      },
      inactive: true,
      created: dateString,
      updated: dateString,
      status: "active"
    }

    service.createRateLimit(modckPayload).subscribe(rateLimit => {
      expect(rateLimit).toEqual(modckPayload);
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(modckPayload)
  });

  it("Simulated updateRateLimit method", () => {
    const dateString = new Date().toString()
    const modckPayload: IRateLimit = {
      uuid:"TEST-RATE-LIMIT",
      name: "test",
      limit_calls:1,
      interval:{
        is_relative:false,
        relative: 1,   
        absolute:{
          start:dateString,
          end:dateString
        }
      },
      inactive: true,
      created: dateString,
      updated: dateString,
      status: "active"
    }

    service.updateRateLimit(modckPayload).subscribe(rateLimit => {
      expect(rateLimit).toEqual(modckPayload);
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/${modckPayload.uuid}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(modckPayload)
  });

  it("Simulated deleteRateLimit method", () => {
    const dateString = new Date().toString()
    const modckPayload: IRateLimit = {
      uuid:"TEST-RATE-LIMIT",
      name: "test",
      limit_calls:1,
      interval:{
        is_relative:false,
        relative: 1,   
        absolute:{
          start:dateString,
          end:dateString
        }
      },
      inactive: true,
      created: dateString,
      updated: dateString,
      status: "active"
    }

    service.deleteRateLimit(modckPayload.uuid).subscribe(rateLimit => {
      expect(rateLimit).toEqual(modckPayload);
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/ratelimits/${modckPayload.uuid}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(modckPayload)
  });
});
