import { TestBed } from '@angular/core/testing';

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ProofsApi } from '../proofs.api';
import { IGetAchievementResponse } from '../interfaces/api.interfaces';
import { AchievementsApi } from '@modules/mobile/achievements/achievements.api';
import { IAchievementsItem } from '@modules/mobile/achievements/models/interfaces/achievements.interfaces';


describe('ProofsApi', () => {
  let service: ProofsApi;
  let httpMock: HttpTestingController;
  let achievementService: AchievementsApi

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ProofsApi);
    achievementService = TestBed.inject(AchievementsApi)
    httpMock = TestBed.inject(HttpTestingController)
  })


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Simulated get Items first option', () => {
    const mockFlushResponse:IGetAchievementResponse = {
      data:
        {
          type: 'Definitions',
          id:'1234',
          attributes: {
            name: 'name',
            summary: 'summary',
            icon: 'https://cdn-icons-png.flaticon.com/128/8557/8557018.png',
            visibility: true,
            streak: true,
            reward_mbx: 10,
            reward_points: 0,
            description: 'description',
            conditions: 'conditions',
            link: 'link',
            proof: {
              type:'IMAGE',
              url:'',
              description:'',
              name: ''
            },
            auto_approve: true,
            started_at: '2022-12-22T10:29:53Z',
            ended_at: '2022-12-22T10:29:53Z',
            notification_announcement: {
              title: 'string',
              body: 'string'
            },
            notification_finished: {
              title: 'string',
              body: 'string'
            }
          }
        }
    }

    const item:IAchievementsItem = achievementService.transformAchievementsAttributes(mockFlushResponse.data)

    const mockResponse:IAchievementsItem = item

    service.getAchievement(item.id).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.APIS.MONOLITH_URL}/backoffice/achievements/${item.id}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('json');
    expect(req.cancelled).toBeFalsy();

    req.flush(mockFlushResponse)
  })
});