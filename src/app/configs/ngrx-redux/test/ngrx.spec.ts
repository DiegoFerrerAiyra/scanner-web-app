import { TestBed } from "@angular/core/testing";
import { ActionReducer } from "@ngrx/store";
import { localStorageSyncReducer } from "../ngrx";

describe('NgRxFactory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({})
     .compileComponents();
  })

  it('should create an instance', () => {
    let reducer:ActionReducer<any> = (state) => state;;
    expect(localStorageSyncReducer(reducer)).toBeTruthy();
  });
});
