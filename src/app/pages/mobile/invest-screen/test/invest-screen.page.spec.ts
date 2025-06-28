import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestScreenComponent } from '../invest-screen.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { InvestScreenApi } from '../../../../modules/mobile/invest-screen/invest-screen.api';
import { ICategoryItemsInvestScreen } from '../../../../modules/mobile/invest-screen/models/constants/invest-screen.constants';
import { of, throwError } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { IDeleteItemInvestResponse, IGetInvestScreenItems, IinvestScreenItem, IReOrderList } from '@modules/mobile/invest-screen/models/interfaces/invest-screen.interfaces';
import { IEmitFile } from '@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces';
import { ITabEventChange } from '@shared/models/interfaces/shared.interfaces';

describe('InvestScreenComponent', () => {
  let component: InvestScreenComponent;
  let fixture: ComponentFixture<InvestScreenComponent>;
  let service: InvestScreenApi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ InvestScreenComponent ],
      providers:[MessageService,InvestScreenApi]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestScreenComponent);
    service = fixture.debugElement.injector.get(InvestScreenApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test change TAB Behavior 1',() => {
    const newEvent:ITabEventChange = {
      index: 0
    }

    component.changeTabPanel(newEvent)

    expect(component.panelSelected).toEqual(ICategoryItemsInvestScreen.EARN)

  })

  it('test change TAB Behavior 2',() => {
    const newEvent:ITabEventChange = {
      index: 1
    }

    component.changeTabPanel(newEvent)

    expect(component.panelSelected).toEqual(ICategoryItemsInvestScreen.SPEND)

  })

  it('Validate create item Dialog',() => {

    const category = ICategoryItemsInvestScreen.SPEND

    component.createItemDialog(category)

    expect(component.titleValue).toEqual('')
    expect(component.linkValue).toEqual('')
    expect(component.imageUrl).toEqual('')
    expect(component.categoryValue).toEqual(ICategoryItemsInvestScreen.SPEND)
    expect(component.activateDialog).toBeTrue()

  })

  it('check editing dialog event for disabled button when isEdition is false',() => {
    component.isEdition = false

    // CASE 1
    component.titleValue = ''

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeTrue()

    // CASE 2
    component.titleValue = 'test'
    component.linkValue = ''

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeTrue()

    // CASE 3
    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = ''

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeTrue()

  })

  it('check editing dialog event for disabled button when isEdition is true',() => {
    component.isEdition = true

    // CASE 1
    component.titleValue = 'test123'

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeFalse()

    // CASE 2
    component.titleValue = ''
    component.linkValue = 'test'

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeFalse()

    // CASE 3
    component.titleValue = ''
    component.linkValue = ''
    component.imageUrl = 'test'

    component.editingDialogEvent()
    expect(component.disabledSaveButton).toBeFalse()

  })

  it('check sortTable EARN',() => {
    component.earnItems = [
      {
        uuid:'asd123',
        title:'Titulo',
        link:'https://test.com.ar',
        image:'asd1234',
        order: 0,
        category: ICategoryItemsInvestScreen.EARN,
        inactive:false
      },
      {
        uuid:'asd124',
        title:'Titulo2',
        link:'https://test.com.ar',
        image:'asd12345',
        order: 1,
        category: ICategoryItemsInvestScreen.EARN,
        inactive:false
      },
    ]

    component.earnItemsCopy = [...component.earnItems]
    component.sortTable(ICategoryItemsInvestScreen.EARN)

    expect(component.isReOrderEarn).toBeFalse()
  })

  it('check sortTable SPEND',() => {
    component.spendItems = [
      {
        uuid:'asd123',
        title:'Titulo',
        link:'https://test.com.ar',
        image:'asd1234',
        order: 0,
        category: ICategoryItemsInvestScreen.SPEND,
        inactive:false
      },
      {
        uuid:'asd124',
        title:'Titulo2',
        link:'https://test.com.ar',
        image:'asd12345',
        order: 1,
        category: ICategoryItemsInvestScreen.SPEND,
        inactive:false
      },
    ]

    component.earnItemsCopy = [...component.spendItems]
    component.sortTable(ICategoryItemsInvestScreen.SPEND)

    expect(component.isReOrderEarn).toBeFalse()
  })

  it('Save re-Order EARN',() => {
    component.earnItems = [
      {
        uuid:'asd123',
        title:'Titulo',
        link:'https://test.com.ar',
        image:'asd1234',
        order: 0,
        category: ICategoryItemsInvestScreen.EARN,
        inactive:false
      },
      {
        uuid:'asd124',
        title:'Titulo2',
        link:'https://test.com.ar',
        image:'asd12345',
        order: 1,
        category: ICategoryItemsInvestScreen.EARN,
        inactive:false
      },
    ]

    
    const spy = spyOn(component, "reOrderTable").and.callThrough();
    
    
    component.saveReOrder(ICategoryItemsInvestScreen.EARN)


    expect(spy).toHaveBeenCalled()

  })

  it('Save re-Order SPEND',() => {
    component.spendItems = [
      {
        uuid:'asd123',
        title:'Titulo',
        link:'https://test.com.ar',
        image:'asd1234',
        order: 0,
        category: ICategoryItemsInvestScreen.SPEND,
        inactive:false
      },
      {
        uuid:'asd124',
        title:'Titulo2',
        link:'https://test.com.ar',
        image:'asd12345',
        order: 1,
        category: ICategoryItemsInvestScreen.SPEND,
        inactive:false
      },
    ]

    
    const spy = spyOn(component, "reOrderTable").and.callThrough();
    
    
    component.saveReOrder(ICategoryItemsInvestScreen.SPEND)


    expect(spy).toHaveBeenCalled()

  })

  it('hide dialog function',() => {
    component.hideDialog()

    expect(component.isEdition).toBeFalse()
    expect(component.activateDialog).toBeFalse()
  })

  it('check save function',() => {
    component.isEdition = true

    const hideDialogSpy = spyOn(component, "hideDialog").and.callThrough();


    component.save()


    expect(hideDialogSpy).toHaveBeenCalled()


  })

  // Create a component individually and remvoe this test for all app
  it('checkUpload',async ()=> {
    const file:IEmitFile = {
      description:'',
      file:new File([""], "test")
    }

    const spy = spyOn(component,'uploadResource').and.callThrough();

    await component.checkUpload(file)


    expect(spy).toHaveBeenCalled();
  })

  it('checkRemoveResource',() => {
    component.removeResourceForm()

    expect(component.uploadedFiles).toEqual([])
    expect(component.imageUrl).toEqual('')
  })

  //----------------- Methods with comunication APIs----------

  // GET
  it('getItems since API',() => {
    const mockResponse:IGetInvestScreenItems = {
      earn:[],
      spend:[]
    }

    const spy = spyOn(service,'getItems').and.callFake(() => {
      return of(mockResponse)
    })

    component.getItems()

    expect(spy).toHaveBeenCalled()
  })

  it('getItems since API ERROR',() => {

    const spy = spyOn(service,'getItems').and.returnValue(throwError(() => new Error('test')))

    component.getItems()

    expect(spy).toHaveBeenCalled()
  })

  // CREATE
  it('createItem since API EARN ITEMS',() => {

    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.EARN

    const mockResponse:IinvestScreenItem = {
      uuid: 'test123',
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      order: 0,
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    const spy = spyOn(service,'createItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.createItem()

    expect(spy).toHaveBeenCalled()
  })

  it('createItem since API SPEND ITEMS',() => {

    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.SPEND

    const mockResponse:IinvestScreenItem = {
      uuid: 'test123',
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      order: 0,
      category: ICategoryItemsInvestScreen.SPEND,
      inactive: false
    }

    const spy = spyOn(service,'createItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.createItem()

    expect(spy).toHaveBeenCalled()
  })

  it('createItem since API ERROR',() => {

    const spy = spyOn(service,'createItem').and.returnValue(throwError(() => new Error('test')))

    component.createItem()

    expect(spy).toHaveBeenCalled()
  })

  // UPDATE
  it('updateItem since API EARN ITEMS',() => {

    component.idValue = '123'
    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.EARN

    const existItem:IinvestScreenItem = {
      uuid: '123',
      title: 'test',
      link: 'test',
      image: 'test',
      inactive: false
    }

    component.earnItems.push(existItem)

    const mockResponse:IinvestScreenItem = {
      uuid: '123',
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      order: 0,
      category: ICategoryItemsInvestScreen.EARN,
      inactive: false
    }

    const spy = spyOn(service,'updateItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.editItem()

    expect(spy).toHaveBeenCalled()
  })

  it('updateItem since API SPEND ITEMS',() => {

    component.idValue = 'test123'
    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.SPEND

    const existItem:IinvestScreenItem = {
      uuid: 'test123',
      title: 'test',
      link: 'test',
      image: 'test',
      inactive: false
    }

    component.spendItems.push(existItem)

    const mockResponse:IinvestScreenItem = {
      uuid: 'test123',
      title: 'Test',
      link: 'http://test.com',
      image: 'testImage',
      order: 0,
      category: ICategoryItemsInvestScreen.SPEND,
      inactive: false
    }

    const spy = spyOn(service,'updateItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.editItem()

    expect(spy).toHaveBeenCalled()
  })

  it('updateItem since API ERROR',() => {

    const spy = spyOn(service,'updateItem').and.returnValue(throwError(() => new Error('test')))

    component.editItem()

    expect(spy).toHaveBeenCalled()
  })

  // DELETE
  it('delete since API EARN ITEMS',() => {

    component.idValue = '123'
    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.EARN

    const existItem:IinvestScreenItem = {
      uuid:'test123',
      title: 'test',
      link: 'test',
      image: 'test',
      inactive: false
    }

    component.earnItems.push(existItem)

    const mockResponse:IDeleteItemInvestResponse = {
      uuid:'test123'
    }

    const spy = spyOn(service,'deleteItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.deleteItem(existItem,ICategoryItemsInvestScreen.EARN)

    expect(spy).toHaveBeenCalled()
  })

  it('delete since API SPEND ITEMS',() => {

    component.idValue = '123'
    component.titleValue = 'test'
    component.linkValue = 'test'
    component.imageUrl = 'test'
    component.categoryValue = ICategoryItemsInvestScreen.SPEND

    const existItem:IinvestScreenItem = {
      uuid:'test123',
      title: 'test',
      link: 'test',
      image: 'test',
      inactive: false
    }

    component.spendItems.push(existItem)

    const mockResponse:IDeleteItemInvestResponse = {
      uuid:'test123'
    }

    const spy = spyOn(service,'deleteItem').and.callFake(() => {
      return of(mockResponse)
    })

    component.deleteItem(existItem,ICategoryItemsInvestScreen.SPEND)

    expect(spy).toHaveBeenCalled()
  })

  it('delete since API ERROR',() => {

    const existItem:IinvestScreenItem = {
      uuid: 'test123',
      title: 'test',
      link: 'test',
      image: 'test',
      inactive: false
    }

    const spy = spyOn(service,'deleteItem').and.returnValue(throwError(() => new Error('test')))

    component.deleteItem(existItem,ICategoryItemsInvestScreen.SPEND)

    expect(spy).toHaveBeenCalled()
  })

  // RE ORDER
  it('reorder API EARN',() => {

    const items:IReOrderList[] = [
      {
       uuid:'asd123',
       order:0,
       category: ICategoryItemsInvestScreen.EARN
      }
     ]

    const mockResponse:IReOrderList[] = [
      {
       uuid:'asd123',
       order:0,
       category: ICategoryItemsInvestScreen.EARN
      }
     ]

    const spy = spyOn(service,'reOrderItems').and.callFake(() => {
      return of(mockResponse)
    })

    component.reOrderTable(items,ICategoryItemsInvestScreen.EARN)

    expect(spy).toHaveBeenCalled()
  })

  it('reorder API SPEND',() => {

    const items:IReOrderList[] = [
      {
       uuid:'asd123',
       order:0,
       category: ICategoryItemsInvestScreen.SPEND
      }
     ]

    const mockResponse:IReOrderList[] = [
      {
       uuid:'asd123',
       order:0,
       category: ICategoryItemsInvestScreen.EARN
      }
     ]

    const spy = spyOn(service,'reOrderItems').and.callFake(() => {
      return of(mockResponse)
    })

    component.reOrderTable(items,ICategoryItemsInvestScreen.SPEND)

    expect(spy).toHaveBeenCalled()
  })

  it('reorder  API ERROR',() => {

    const items:IReOrderList[] = [
     {
      uuid:'asd123',
      order:0,
      category: ICategoryItemsInvestScreen.SPEND
     }
    ]

    const spy = spyOn(service,'reOrderItems').and.returnValue(throwError(() => new Error('test')))

    component.reOrderTable(items,ICategoryItemsInvestScreen.SPEND)

    expect(spy).toHaveBeenCalled()
  })
});
