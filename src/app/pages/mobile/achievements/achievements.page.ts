import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ErrorsManager } from "@core/errors/errors.manager";
import { FilesApi } from "@core/files/files.api";
import { FilesManager } from "@core/files/files.manager";
import { CBucketTypeSecurity } from "@core/files/models/constants/files.constants";
import { IDataResource } from "@core/files/models/interfaces/resource.interface";
import { AchievementsApi } from "@modules/mobile/achievements/achievements.api";
import { CAchievementsProof } from "@modules/mobile/achievements/models/constants/achievements.constants";
import { IAchievementsItem, ICategory } from "@modules/mobile/achievements/models/interfaces/achievements.interfaces";
import { IGetAchievementsResponseAttributes } from "@modules/mobile/achievements/models/interfaces/api.interfaces";
import { DeriverablesFileType, FileTypes } from "@shared/components/dumb/file-upload/models/constants/file-upload.constants";
import { IEmitFile } from "@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces";
import { DateTime } from "luxon";
import { Table } from "primeng/table";

@Component({
  selector: "mdk-achievements",
  templateUrl: "./achievements.page.html",
  styleUrls: ["./achievements.page.scss"],
})
export class AchievementsComponent implements OnInit {
  achievementsItems: IAchievementsItem[] = [];
  achievementsSelectedItem: IAchievementsItem[] = [];

  // Items create or edit
  itemEmpty: IAchievementsItem = {
    name: "",
    miniDescription: "",
    icon: null,
    visibility: false,
    MBXRewards: null,
    startDate: null,
    endDate: null,
    bigDescription: "",
    contributes: false,
    pointsRewards: null,
    conditions: "",
    proof: {
      type: CAchievementsProof.NONE,
      url: "",
      description: "",
      name: "",
    },
    automaticPayment: false,
    annoucementNotificationTitle: "",
    annoucementNotificationDescription: "",
    finishedNotificationTitle: "",
    finishedNotificationDescription: "",
    id: "",
    link: "",
  };

  itemTemp: IAchievementsItem = {
    name: "",
    link: "",
    miniDescription: "",
    icon: null,
    visibility: false,
    MBXRewards: null,
    startDate: null,
    endDate: null,
    bigDescription: "",
    contributes: false,
    pointsRewards: null,
    conditions: "",
    proof: {
      type: CAchievementsProof.NONE,
      url: "",
      description: "",
      name: "",
    },
    automaticPayment: false,
    annoucementNotificationTitle: "",
    annoucementNotificationDescription: "",
    finishedNotificationTitle: "",
    finishedNotificationDescription: "",
    id: "",
  };

  itemTempCopy: IAchievementsItem = {
    name: "",
    miniDescription: "",
    link: "",
    icon: null,
    visibility: false,
    MBXRewards: null,
    startDate: null,
    endDate: null,
    bigDescription: "",
    contributes: false,
    pointsRewards: null,
    conditions: "",
    proof: {
      type: CAchievementsProof.NONE,
      url: "",
      description: "",
      name: "",
    },
    automaticPayment: false,
    annoucementNotificationTitle: "",
    annoucementNotificationDescription: "",
    finishedNotificationTitle: "",
    finishedNotificationDescription: "",
    id: "",
  };

  // Flags
  activateDialog: boolean = false;
  isEdition: boolean = false;
  newImageSelected: boolean = false;
  disabledSaveButton: boolean = true;

  // Image upload
  fileType: (typeof FileTypes)[keyof typeof FileTypes] = FileTypes["IMAGE"];
  selectedCategory: ICategory = {
    name: DeriverablesFileType.IMAGE,
    uuid: "",
    inactive: false,
  };
  infoTitle: string = "";
  infoMessages: string[] = [""];
  uploadingImage: boolean = false;
  mimeType!: string;
  fileName?: string;
  uploadedFiles: any[] = [];

  @ViewChild("dt") table: Table;

  private readonly errorsManager:ErrorsManager = inject(ErrorsManager)
  private readonly achievementsApi:AchievementsApi = inject(AchievementsApi)
  private readonly filesApi:FilesApi = inject(FilesApi)
  private readonly filesManager:FilesManager = inject(FilesManager)

  ngOnInit(): void {
    this.getAchievements();
  }

  ////.........................................................................................
  // DIALOG LOGIC
  createItemDialog(): void {
    this.itemTemp = { ...this.itemEmpty };
    this.activateDialog = true;
  }

  editItemDialog(item: IAchievementsItem) {
    this.itemTemp = item;

    //copy
    this.itemTempCopy = { ...this.itemTemp };

    this.isEdition = true;
    this.activateDialog = true;
  }

  async editingDialogEvent(): Promise<void> {
    this.disabledSaveButton = this.isEdition
      ? await this.validateInputsForEdition()
      : await this.validateInputsForCreate();
  }

  hideDialog() {
    this.isEdition = false;
    this.activateDialog = false;
    this.itemTemp = this.itemEmpty;
  }

  save() {
    this.isEdition ? this.editAchievement() : this.createAchievement();
    this.hideDialog();
  }

  async validateInputsForCreate(): Promise<boolean> {
    const proofValidate = await this.validateProofCreate();
    return (
      this.itemTemp.name === "" ||
        this.itemTemp.miniDescription === "" ||
        this.itemTemp.icon === null ||
        this.itemTemp.link === "" ||
        this.itemTemp.MBXRewards === null ||
        this.itemTemp.bigDescription === "" ||
        this.itemTemp.conditions === "" ||
        this.itemTemp.startDate === null,
      this.itemTemp.endDate === null,
      this.itemTemp.annoucementNotificationTitle === "" ||
        this.itemTemp.annoucementNotificationDescription === "" ||
        this.itemTemp.finishedNotificationTitle === "" ||
        this.itemTemp.finishedNotificationDescription === "" ||
        proofValidate ||
        this.hasntValidDates(this.itemTemp)
    );
  }

  async validateInputsForEdition(): Promise<boolean> {
    const proofValidate = await this.validateProofEdition();
    return !(
      (this.itemTemp.name !== this.itemTempCopy.name &&
        this.itemTemp.name !== "") ||
      (this.itemTemp.link !== this.itemTempCopy.link &&
        this.itemTemp.link !== "") ||
      (this.itemTemp.miniDescription !== this.itemTempCopy.miniDescription &&
        this.itemTemp.miniDescription !== "") ||
      (this.itemTemp.visibility !== this.itemTempCopy.visibility &&
        this.itemTemp.visibility !== null) ||
      (this.itemTemp.contributes !== this.itemTempCopy.contributes &&
        this.itemTemp.contributes !== null) ||
      (this.itemTemp.icon !== this.itemTempCopy.icon &&
        this.itemTemp.icon !== "") ||
      (this.itemTemp.MBXRewards !== this.itemTempCopy.MBXRewards &&
        this.itemTemp.MBXRewards !== null) ||
      (this.itemTemp.pointsRewards !== this.itemTempCopy.pointsRewards &&
        this.itemTemp.pointsRewards !== null) ||
      (this.itemTemp.bigDescription !== this.itemTempCopy.bigDescription &&
        this.itemTemp.bigDescription !== "") ||
      (this.itemTemp.conditions !== this.itemTempCopy.conditions &&
        this.itemTemp.conditions !== "") ||
      proofValidate ||
      (this.itemTemp.startDate !== this.itemTempCopy.startDate &&
        this.itemTemp.startDate !== null &&
        !this.hasntValidDates(this.itemTemp)) ||
      (this.itemTemp.endDate !== this.itemTempCopy.endDate &&
        this.itemTemp.endDate !== null &&
        !this.hasntValidDates(this.itemTemp)) ||
      (this.itemTemp.annoucementNotificationTitle !==
        this.itemTempCopy.annoucementNotificationTitle &&
        this.itemTemp.annoucementNotificationTitle !== "") ||
      (this.itemTemp.annoucementNotificationDescription !==
        this.itemTempCopy.annoucementNotificationDescription &&
        this.itemTemp.annoucementNotificationDescription !== "") ||
      (this.itemTemp.finishedNotificationTitle !==
        this.itemTempCopy.finishedNotificationTitle &&
        this.itemTemp.finishedNotificationTitle !== "") ||
      (this.itemTemp.finishedNotificationDescription !==
        this.itemTempCopy.finishedNotificationDescription &&
        this.itemTemp.finishedNotificationDescription !== "")
    );
  }

  async validateProofCreate(): Promise<boolean> {
    return (
      (this.itemTemp.proof.type === CAchievementsProof.TEXT &&
        this.itemTemp.proof.description === "") ||
      (this.itemTemp.proof.type === CAchievementsProof.IMAGE &&
        this.itemTemp.proof.url === "") ||
      (this.itemTemp.proof.type === CAchievementsProof.IMAGE_TEXT &&
        this.itemTemp.proof.url === "" &&
        this.itemTemp.proof.description === "")
    );
  }

  async validateProofEdition(): Promise<boolean> {
    return (
      this.itemTemp.proof !== this.itemTempCopy.proof ||
      (this.itemTemp.proof.type === CAchievementsProof.TEXT &&
        this.itemTemp.proof.description !== "") ||
      (this.itemTemp.proof.type === CAchievementsProof.IMAGE &&
        this.itemTemp.proof.url !== "") ||
      (this.itemTemp.proof.type === CAchievementsProof.IMAGE_TEXT &&
        this.itemTemp.proof.url !== "" &&
        this.itemTemp.proof.description !== "")
    );
  }

  ////........................................................................................
  // Generates body and blob to send to the api
  async checkUpload(data: IEmitFile, isProof?: boolean) {
    this.uploadingImage = true;
    this.mimeType = data.file.type;
    this.fileName = data.file.name;

    const dataResource = await this.filesManager.dataResource(data);

    this.uploadResource(dataResource, isProof);
  }

  // Uploads resource to s3
  uploadResource(dataResource: IDataResource, isProof?: boolean): void {
    this.filesApi
      .uploadResourceDynamic(
        dataResource,
        CBucketTypeSecurity.PUBLIC,
        "achievements"
      )
      .subscribe({
        next: (response) => {
          if (!isProof) {
            this.itemTemp.icon = response;
            this.uploadingImage = false;
            this.editingDialogEvent();
            return;
          }
          this.itemTemp.proof.url = response;
          this.uploadingImage = false;
          this.editingDialogEvent();
        },
        error: (error: HttpErrorResponse) => {
          this.errorsManager.manageErrors(error);
          this.itemTemp.icon = "";
          this.uploadingImage = false;
        },
      });
  }

  removeResourceForm(): void {
    this.uploadedFiles = [];
    this.itemTemp.icon = "";
  }

  removeImageProof(): void {
    this.itemTemp.proof.url = this.itemTempCopy.proof.url;
  }
  ////........................................................................................
  // APIs

  getAchievements(): void {
    this.achievementsApi.getItems().subscribe({
      next: (response) => (this.achievementsItems = response),
      error: (response: HttpErrorResponse) => {
        this.errorsManager.manageErrors(response);
      },
    });
  }

  createAchievement(): void {
    let copyItem = this.itemTemp;

    const achievement: IGetAchievementsResponseAttributes = {
      name: this.itemTemp.name,
      summary: this.itemTemp.miniDescription,
      icon: this.itemTemp.icon,
      visibility: this.itemTemp.visibility,
      streak: this.itemTemp.contributes,
      reward_mbx: this.itemTemp.MBXRewards,
      reward_points: this.itemTemp.pointsRewards,
      description: this.itemTemp.bigDescription,
      conditions: this.itemTemp.conditions,
      proof: this.itemTemp.proof,
      auto_approve: false,
      started_at: DateTime.fromJSDate(this.itemTemp.startDate).toISO(),
      ended_at: DateTime.fromJSDate(this.itemTemp.endDate).toISO(),
      notification_announcement: {
        title: this.itemTemp.annoucementNotificationTitle,
        body: this.itemTemp.annoucementNotificationDescription,
      },
      notification_finished: {
        title: this.itemTemp.finishedNotificationTitle,
        body: this.itemTemp.finishedNotificationDescription,
      },
      link: this.itemTemp.link,
    };

    this.achievementsApi.createItem(achievement).subscribe({
      next: (response) => {
        copyItem.id = response.data.id;
        this.achievementsItems = [...this.achievementsItems, copyItem];
      },
      error: (response: HttpErrorResponse) => {
        this.errorsManager.manageErrors(response);
      },
    });
  }

  editAchievement(): void {
    const achievementId = this.itemTemp.id;

    const achievement: IGetAchievementsResponseAttributes = {
      name: this.itemTemp.name,
      summary: this.itemTemp.miniDescription,
      icon: this.itemTemp.icon,
      visibility: this.itemTemp.visibility,
      streak: this.itemTemp.contributes,
      reward_mbx: this.itemTemp.MBXRewards,
      reward_points: this.itemTemp.pointsRewards,
      description: this.itemTemp.bigDescription,
      conditions: this.itemTemp.conditions,
      proof: this.itemTemp.proof,
      auto_approve: false,
      started_at: DateTime.fromJSDate(this.itemTemp.startDate).toISO(),
      ended_at: DateTime.fromJSDate(this.itemTemp.endDate).toISO(),
      notification_announcement: {
        title: this.itemTemp.annoucementNotificationTitle,
        body: this.itemTemp.annoucementNotificationDescription,
      },
      notification_finished: {
        title: this.itemTemp.finishedNotificationTitle,
        body: this.itemTemp.finishedNotificationDescription,
      },
      link: this.itemTemp.link,
    };

    this.achievementsApi.updateItem(achievement, achievementId).subscribe({
      next: (response) => {
        const index = this.achievementsItems.findIndex(
          (item) => item.id === response.id
        );
        this.achievementsItems[index] = response;
      },
      error: (response: HttpErrorResponse) => {
        this.errorsManager.manageErrors(response);
      },
    });
  }

  canEditVisibility(item: IAchievementsItem): boolean {
    const startDate = new Date(item.startDate);
    const now = new Date();
    return !(startDate < now && item.visibility);
  }

  editVisibility(item: IAchievementsItem): void {
    this.achievementsApi.updateVisibility(item.id, item.visibility).subscribe({
      next: () => this.getAchievements(),
      error: (response: HttpErrorResponse) => {
        this.errorsManager.manageErrors(response);
      },
    });
  }

  hasntValidDates(item: IAchievementsItem): boolean {
    return (
      DateTime.fromJSDate(item.startDate) > DateTime.fromJSDate(item.endDate)
    );
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains')
  }

}
