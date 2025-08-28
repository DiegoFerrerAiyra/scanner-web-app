import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { MessageService } from 'primeng/api';

import { UsersComponent } from '../scanner.page';
import { UsersApi } from '@modules/scanner/scanner-small-caps/scanner.api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { LoaderService } from '@shared/components/dumb/spinner/loader.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ UsersComponent ],
      providers:[
        MessageService,
        UsersApi,
        ErrorsManager,
        LoaderService,
        provideMockStore(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
