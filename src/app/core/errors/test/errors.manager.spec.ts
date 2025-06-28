import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorCustomMessages } from '../models/constants/custom-messages.constants';
import { ErrorsManager } from '../errors.manager';
import { NewErrorModak } from '@core/errors/models/interface/error-modak';



describe('ErrorsManagerService', () => {
  let service: ErrorsManager;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      providers:[MessageService]
    });
    service = TestBed.inject(ErrorsManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create verify error type',() => {
    const error = new NewErrorModak({
      code:'',
      message:ErrorCustomMessages.PROJECT_NOT_EXISTS
    })
    const serviceSpy = spyOn(service,'manageErrors').and.callThrough()
    service.manageErrors(error)

    expect(serviceSpy).toHaveBeenCalledTimes(1);
  })

});
