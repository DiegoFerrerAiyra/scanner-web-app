import { TestBed } from '@angular/core/testing';
import { ManageCardsApi } from '../manage-cards.api';
import { MessageService } from 'primeng/api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ManageCardsApi', () => {
  let service: ManageCardsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorsManager, ManageCardsApi, MessageService, HttpClient, HttpHandler],
    });
    service = TestBed.inject(ManageCardsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
