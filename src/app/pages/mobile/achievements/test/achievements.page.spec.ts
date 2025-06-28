import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AchievementsComponent } from "../achievements.page";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { AchievementsApi } from "../../../../modules/mobile/achievements/achievements.api";
import { IAchievementsItem } from "../../../../modules/mobile/achievements/models/interfaces/achievements.interfaces";
import {
  IGetAchievementsResponse,
  ICreateAchievementsResponse,
} from "../../../../modules/mobile/achievements/models/interfaces/api.interfaces";
import { of, throwError } from "rxjs";
import { SharedModule } from "@shared/shared.module";
import { IEmitFile } from "@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces";

describe("AchievementsComponent", () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;
  let service: AchievementsApi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
      ],
      declarations: [AchievementsComponent],
      providers: [MessageService, AchievementsApi],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsComponent);
    service = fixture.debugElement.injector.get(AchievementsApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Validate update item Dialog", () => {
    const item: IAchievementsItem = {
      id: "",
      name: "",
      miniDescription: "",
      bigDescription: "",
      icon: "",
      visibility: false,
      contributes: false,
      MBXRewards: 0,
      pointsRewards: 0,
      startDate: undefined,
      endDate: undefined,
      conditions: "",
      proof: {
        type: "NONE",
        url: "",
        description: "",
        name: "",
      },
      automaticPayment: false,
      annoucementNotificationTitle: "",
      annoucementNotificationDescription: "",
      finishedNotificationTitle: "",
      finishedNotificationDescription: "",
      link: "",
    };

    component.editItemDialog(item);

    expect(component.itemTemp).toEqual(item);
    expect(component.activateDialog).toBeTrue();
    expect(component.isEdition).toBeTrue();
  });

  it("Validate create item Dialog", () => {
    component.createItemDialog();

    expect(component.itemTemp).toEqual(component.itemEmpty);
    expect(component.activateDialog).toBeTrue();
  });

  it("dialog event edition true", () => {
    component.isEdition = true;
    component.editingDialogEvent();

    expect(component.disabledSaveButton).toBeTrue();
  });

  it("dialog event edition false", () => {
    component.isEdition = false;
    component.editingDialogEvent();

    expect(component.disabledSaveButton).toBeTrue();
  });

  it("hide dialog function", () => {
    component.hideDialog();

    expect(component.isEdition).toBeFalse();
    expect(component.activateDialog).toBeFalse();
  });

  it("check save function edition true", () => {
    component.isEdition = true;

    const hideDialogSpy = spyOn(component, "hideDialog").and.callThrough();

    component.save();

    expect(hideDialogSpy).toHaveBeenCalled();
  });

  it("check save function edition false", () => {
    component.isEdition = false;

    const hideDialogSpy = spyOn(component, "hideDialog").and.callThrough();

    component.save();

    expect(hideDialogSpy).toHaveBeenCalled();
  });

  it("validate inputs for create", async () => {
    const item: IAchievementsItem = {
      id: "1234",
      name: "name",
      miniDescription: "miniDescription",
      bigDescription: "bigDescription",
      icon: "icon",
      visibility: true,
      contributes: false,
      MBXRewards: 0,
      pointsRewards: 0,
      startDate: undefined,
      endDate: undefined,
      conditions: "conditions",
      proof: {
        type: "NONE",
        url: "",
        description: "",
        name: "",
      },
      automaticPayment: false,
      annoucementNotificationTitle: "annoucementNotificationTitle",
      annoucementNotificationDescription: "annoucementNotificationDescription",
      finishedNotificationTitle: "finishedNotificationTitle",
      finishedNotificationDescription: "finishedNotificationDescription",
      link: "",
    };

    component.itemTemp = { ...item };

    const result: boolean = await component.validateInputsForCreate();

    expect(result).toBeFalse();
  });

  it("validate inputs for edition", async () => {
    const item: IAchievementsItem = {
      id: "",
      name: "",
      miniDescription: "",
      bigDescription: "",
      icon: "",
      visibility: true,
      contributes: false,
      MBXRewards: 0,
      pointsRewards: 0,
      startDate: undefined,
      endDate: undefined,
      conditions: "",
      proof: null,
      automaticPayment: false,
      annoucementNotificationTitle: "",
      annoucementNotificationDescription: "",
      finishedNotificationTitle: "",
      finishedNotificationDescription: "",
      link: "",
    };

    component.itemTemp = { ...item };

    const result: boolean = await component.validateInputsForEdition();

    expect(result).toBeFalse();
  });

  it("checkUpload", async () => {
    const file: IEmitFile = {
      description: "",
      file: new File([""], "test"),
    };

    const spy = spyOn(component, "uploadResource").and.callThrough();

    await component.checkUpload(file);

    expect(spy).toHaveBeenCalled();
  });

  it("checkRemoveResource", () => {
    component.removeResourceForm();

    expect(component.uploadedFiles).toEqual([]);
    expect(component.itemTemp.icon).toEqual("");
  });

  //----------------- Methods with comunication APIs----------

  // GET
  it("getItems since API", () => {
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

    const spy = spyOn(service, "getItems").and.callFake(() => {
      return of(mockResponse);
    });

    component.getAchievements();

    expect(spy).toHaveBeenCalled();
  });

  it("getItems since API ERROR", () => {
    const spy = spyOn(service, "getItems").and.returnValue(
      throwError(() => new Error("test"))
    );

    component.getAchievements();

    expect(spy).toHaveBeenCalled();
  });

  it("create Item API", () => {
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

    const spy = spyOn(service, "createItem").and.callFake(() => {
      return of(mockResponse);
    });

    component.createAchievement();

    expect(spy).toHaveBeenCalled();
  });

  it("create since API ERROR", () => {
    const spy = spyOn(service, "createItem").and.returnValue(
      throwError(() => new Error("test"))
    );

    component.createAchievement();

    expect(spy).toHaveBeenCalled();
  });

  it("update Item API", () => {
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

    const spy = spyOn(service, "updateItem").and.callFake(() => {
      return of(mockResponse);
    });

    component.editAchievement();

    expect(spy).toHaveBeenCalled();
  });

  it("create since API ERROR", () => {
    const spy = spyOn(service, "updateItem").and.returnValue(
      throwError(() => new Error("test"))
    );

    component.editAchievement();

    expect(spy).toHaveBeenCalled();
  });
});
