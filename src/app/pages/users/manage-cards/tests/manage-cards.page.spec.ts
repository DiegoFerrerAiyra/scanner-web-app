import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardsComponent } from '../manage-cards.page';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@shared/shared.module';
import { provideMockStore } from '@ngrx/store/testing';

describe('ManageCardsComponent', () => {
  let component: ManageCardsComponent;
  let fixture: ComponentFixture<ManageCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardsComponent ],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [MessageService, provideMockStore()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
