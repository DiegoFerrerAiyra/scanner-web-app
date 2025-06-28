import { TestBed } from "@angular/core/testing";

import { AchievementsApi } from "../achievements.api";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { IAchievementsItem } from "../models/interfaces/achievements.interfaces";
import {
  IGetAchievementsResponse,
  IGetAchievementsResponseAttributes,
  ICreateAchievementsResponse,
} from "../models/interfaces/api.interfaces";
import { environment } from "src/environments/environment";

describe("AchievementsApi", () => {
  let service: AchievementsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AchievementsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Simulated get Items first option", () => {
    const mockFlushResponse: IGetAchievementsResponse = {
      data: [
        {
          type: "Definitions",
          id: "1234",
          attributes: {
            name: "name",
            summary: "summary",
            icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
            visibility: true,
            streak: true,
            reward_mbx: 10,
            reward_points: 0,
            description: "description",
            conditions: "conditions",
            link: "link",
            proof: {
              type: "IMAGE",
              url: "",
              description: "",
              name: "",
            },
            auto_approve: true,
            started_at: "2022-12-22T10:29:53Z",
            ended_at: "2022-12-22T10:29:53Z",
            notification_announcement: {
              title: "string",
              body: "string",
            },
            notification_finished: {
              title: "string",
              body: "string",
            },
          },
        },
      ],
    };

    const item: IAchievementsItem = service.transformAchievementsAttributes(
      mockFlushResponse.data[0]
    );

    const mockResponse: IAchievementsItem[] = [item];

    service.getItems().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.APIS.MONOLITH_URL}/backoffice/achievements`
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.responseType).toEqual("json");
    expect(req.cancelled).toBeFalsy();

    req.flush(mockFlushResponse);
  });

  it("Simulated get Items second option", () => {
    const mockFlushResponse: IGetAchievementsResponse = {
      data: [
        {
          type: "Definitions",
          id: "1234",
          attributes: {
            name: "",
            summary: "",
            icon: "",
            visibility: null,
            streak: null,
            reward_mbx: 0,
            reward_points: 10,
            description: "",
            conditions: "",
            link: "link",
            proof: null,
            auto_approve: null,
            started_at: null,
            ended_at: null,
            notification_announcement: {
              title: "",
              body: "",
            },
            notification_finished: {
              title: "",
              body: "",
            },
          },
        },
      ],
    };

    const item: IAchievementsItem = service.transformAchievementsAttributes(
      mockFlushResponse.data[0]
    );

    const mockResponse: IAchievementsItem[] = [item];

    service.getItems().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.APIS.MONOLITH_URL}/backoffice/achievements`
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.responseType).toEqual("json");
    expect(req.cancelled).toBeFalsy();

    req.flush(mockFlushResponse);
  });

  it("Simulated create item", () => {
    const item: IGetAchievementsResponseAttributes = {
      name: "name",
      summary: "summary",
      icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
      visibility: true,
      streak: true,
      reward_mbx: 10,
      reward_points: 0,
      description: "description",
      conditions: "conditions",
      proof: {
        type: "IMAGE",
        url: "",
        description: "",
        name: "",
      },
      auto_approve: true,
      started_at: "2022-12-22T10:29:53Z",
      ended_at: "2022-12-22T10:29:53Z",
      notification_announcement: {
        title: "string",
        body: "string",
      },
      notification_finished: {
        title: "string",
        body: "string",
      },
      link: "",
    };

    const mockResponse: ICreateAchievementsResponse = {
      data: {
        type: "Definitions",
        id: "1234",
        attributes: {
          name: "name",
          summary: "summary",
          icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
          visibility: true,
          streak: true,
          reward_mbx: 10,
          reward_points: 0,
          description: "description",
          conditions: "conditions",
          link: "link",
          proof: {
            type: "IMAGE",
            url: "",
            description: "",
            name: "",
          },
          auto_approve: true,
          started_at: "2022-12-22T10:29:53Z",
          ended_at: "2022-12-22T10:29:53Z",
          notification_announcement: {
            title: "string",
            body: "string",
          },
          notification_finished: {
            title: "string",
            body: "string",
          },
        },
      },
    };

    service.createItem(item).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.APIS.MONOLITH_URL}/backoffice/achievements`
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.responseType).toEqual("json");
    expect(req.cancelled).toBeFalsy();

    req.flush(mockResponse);
  });

  it("Simulated update item", () => {
    const idItem = "1234";
    const item: IGetAchievementsResponseAttributes = {
      name: "name",
      summary: "summary",
      icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
      visibility: true,
      streak: true,
      reward_mbx: 10,
      reward_points: 5,
      description: "description",
      conditions: "conditions",
      proof: {
        type: "IMAGE",
        url: "",
        description: "",
        name: "",
      },
      auto_approve: true,
      started_at: "2022-12-22T10:29:53Z",
      ended_at: "2022-12-22T10:29:53Z",
      notification_announcement: {
        title: "string",
        body: "string",
      },
      notification_finished: {
        title: "string",
        body: "string",
      },
      link: "",
    };

    const mockFlushResponse: ICreateAchievementsResponse = {
      data: {
        type: "Definitions",
        id: "1234",
        attributes: {
          name: "name",
          summary: "summary",
          icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
          visibility: true,
          streak: true,
          reward_mbx: 10,
          reward_points: 5,
          description: "description",
          conditions: "",
          link: "",
          proof: {
            type: "IMAGE",
            url: "",
            description: "",
            name: "",
          },
          auto_approve: false,
          started_at: null,
          ended_at: null,
          notification_announcement: {
            title: "string",
            body: "string",
          },
          notification_finished: {
            title: "string",
            body: "string",
          },
        },
      },
    };

    const mockResponse: IAchievementsItem = {
      id: "1234",
      name: "name",
      miniDescription: "summary",
      bigDescription: "description",
      icon: "https://cdn-icons-png.flaticon.com/128/8557/8557018.png",
      visibility: true,
      contributes: true,
      MBXRewards: 10,
      pointsRewards: 5,
      startDate: null,
      endDate: null,
      conditions: "",
      proof: {
        type: "IMAGE",
        url: "",
        description: "",
        name: "",
      },
      automaticPayment: false,
      annoucementNotificationTitle: "string",
      annoucementNotificationDescription: "string",
      finishedNotificationTitle: "string",
      finishedNotificationDescription: "string",
      link: "",
    };

    service.updateItem(item, idItem).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.APIS.MONOLITH_URL}/backoffice/achievements/${idItem}`
    );
    expect(req.request.method).toBe("PUT");
    expect(req.request.responseType).toEqual("json");
    expect(req.cancelled).toBeFalsy();

    req.flush(mockFlushResponse);
  });
});
