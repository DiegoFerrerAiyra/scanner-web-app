import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProofsComponent } from '../proofs.page';

import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProofsApi } from '../../../../../../modules/mobile/achievements/proofs/proofs.api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProofsComponent', () => {
  let component: ProofsComponent;
  let fixture: ComponentFixture<ProofsComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
    const routeSnapShot = {
      snapshot:{params: {id: 'id'}}
    }
    await TestBed.configureTestingModule({
      imports:[
        RouterTestingModule.withRoutes(
          [
            {
              path: `mobile/achievements/:id`,
              component: ProofsComponent
            },
          ]
        ),
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [MessageService, ConfirmationService, ProofsApi, 
        { provide: ActivatedRouteSnapshot, useValue: routeSnapShot}],
      declarations: [ ProofsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofsComponent);
    messageService = TestBed.inject(MessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(messageService).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
