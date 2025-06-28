import { TestBed } from '@angular/core/testing';

import { InvestScreenApi } from '../invest-screen.api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ICategoryItemsInvestScreen } from '../models/constants/invest-screen.constants';
import { IDeleteItemInvestResponse, IGetInvestScreenItems, IinvestScreenItem, IReOrderList } from '@modules/mobile/invest-screen/models/interfaces/invest-screen.interfaces';

describe('InvestScreenApi', () => {
  let service: InvestScreenApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
  })

  beforeEach(() => {
    service = TestBed.inject(InvestScreenApi);
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => { 
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Simulated get Items', () => {
    const mockResponse:IGetInvestScreenItems = {
      earn:[],
      spend:[]
    }

    service.getItems().subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/invests`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse)
  })

  it('Simulated Create Item',() => {

    const item: IinvestScreenItem ={
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    const mockResponse:IinvestScreenItem = {
      uuid: 'test123',
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      order: 0,
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    service.createItem(item).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/invests`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse)
  })

  it('Simulated Update Item',() => {

    const item: IinvestScreenItem ={
      uuid: 'NewTestTitle',
      order: 2,
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    const mockResponse:IinvestScreenItem = {
      uuid: 'test123',
      title: 'NewTest',
      link: 'http://test.com',
      image: 'testImage',
      order: 1,
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    service.updateItem(item).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/invests/${item.uuid}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse)
  })

  it('Simulated Delete Item',() => {

    const item: IinvestScreenItem ={
      uuid: 'test123',
      order: 2,
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    const mockResponse:IDeleteItemInvestResponse = {
      uuid:'test123'
    }

    service.deleteItem(item).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/invests/${item.uuid}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse)
  })

  it('Simulated reorder list',() => {

    const items: IReOrderList[] = [
      {
        uuid:'asd123',
        order: 0,
        category: ICategoryItemsInvestScreen.SPEND,
      },
      {
        uuid:'asd124',
        order: 1,
        category: ICategoryItemsInvestScreen.SPEND,
      },

    ]

    const mockResponse:IReOrderList[] = [
      {
        uuid:'asd123',
        order: 0,
        category: ICategoryItemsInvestScreen.SPEND,
      },      
      {
        uuid:'asd124',
        order: 1,
        category: ICategoryItemsInvestScreen.SPEND,
      },
          
    ]


    service.reOrderItems(items).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/invests/reorder`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse)
  })

});