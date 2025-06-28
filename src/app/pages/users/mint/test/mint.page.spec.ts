import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { MessageService } from 'primeng/api';

import { MintComponent } from '../mint.page';

describe('MintComponent', () => {
  let component: MintComponent;
  let fixture: ComponentFixture<MintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ MintComponent ],
      providers:[
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
