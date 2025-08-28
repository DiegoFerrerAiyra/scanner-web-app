import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsersApi } from '../scanner.api';
import { UsersUtils } from '../users.utils';
import { ErrorsManager } from '@core/errors/errors.manager';
import { MessageService } from 'primeng/api';

describe('UsersApi', () => {
  let service: UsersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [UsersUtils, ErrorsManager, UsersApi, MessageService],
    });
    service = TestBed.inject(UsersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
