import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { ErrorsManager } from "@core/errors/errors.manager";
import { FilesApi } from "@core/files/files.api";
import { FilesManager } from "@core/files/files.manager";
import { CBucketTypeSecurity } from "@core/files/models/constants/files.constants";
import { IDataResource } from "@core/files/models/interfaces/resource.interface";
import { InvestScreenApi } from "@modules/mobile/invest-screen/invest-screen.api";
import { IinvestScreenItem, IReOrderList } from "@modules/mobile/invest-screen/models/interfaces/invest-screen.interfaces";
import { DeriverablesFileType, FileTypes } from "@shared/components/dumb/file-upload/models/constants/file-upload.constants";
import { ICategory, IEmitFile } from "@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces";
import { ITabEventChange } from "@shared/models/interfaces/shared.interfaces";
import { ICategoryItemsInvestScreen } from "../../../modules/mobile/invest-screen/models/constants/invest-screen.constants";

@Component({
  selector: "mdk-invest-screen",
  templateUrl: "./invest-screen.page.html",
  styleUrls: ["./invest-screen.page.scss"],
})
export class InvestScreenComponent implements OnInit {
  panelSelected: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen] =
    ICategoryItemsInvestScreen.EARN;

  earnItems: IinvestScreenItem[] = [];
  earnItemsCopy: IinvestScreenItem[] = [];
  earnSelectedItem: IinvestScreenItem[] = [];

  spendItems: IinvestScreenItem[] = [];
  spendItemsCopy: IinvestScreenItem[] = [];
  spendSelectedItem: IinvestScreenItem[] = [];

  activateDialog: boolean = false;
  isEdition: boolean = false;
  newImageSelected: boolean = false;
  disabledSaveButton: boolean = true;
  isReOrderEarn: boolean = false;
  isReOrderSpend: boolean = false;

  // Values item
  idValue: string = "";
  titleValue: string = "";
  linkValue: string = "";
  imageUrl: string = "";
  categoryValue!: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen];

  // Edit item copy
  editItemCopy: IinvestScreenItem = {
    title: "",
    link: "",
    image: "",
    category: 'SPEND',
    inactive: false,
  };

  // Image upload
  fileType: (typeof FileTypes)[keyof typeof FileTypes] = FileTypes["IMAGE"];
  selectedCategory: ICategory = {
    name: DeriverablesFileType.IMAGE,
  };

  infoTitle: string = "";
  infoMessages: string[] = [""];
  uploadingImage: boolean = false;
  mimeType!: string;
  fileName?: string;
  uploadedFiles: any[] = [];

  private readonly investScreenApi:InvestScreenApi = inject(InvestScreenApi)
  private readonly filesApi:FilesApi = inject(FilesApi)
  private readonly filesManager:FilesManager = inject(FilesManager)
  private readonly errorsManager:ErrorsManager = inject(ErrorsManager)

  ngOnInit(): void {
    this.getItems();
  }

  changeTabPanel(event: ITabEventChange): void {
    this.panelSelected = event.index === 0 ? ICategoryItemsInvestScreen.EARN : ICategoryItemsInvestScreen.SPEND;
  }

  sortTable(category: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen]): void {
    if (category === ICategoryItemsInvestScreen.EARN)
      this.isReOrderEarn = this.earnItems.some((value, index) => value !== this.earnItemsCopy[index]);
    if (category === ICategoryItemsInvestScreen.SPEND)
      this.isReOrderSpend = this.spendItems.some((value, index) => value !== this.spendItemsCopy[index]);
  }

  saveReOrder(category: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen]): void {
    if (category === ICategoryItemsInvestScreen.EARN) {
      const transformList: IReOrderList[] = this.earnItems.map(
        (element, index) => {
          const newElement: IReOrderList = {
            uuid: element.uuid || '',
            order: index,
            category: element.category || 'SPEND',
          };
          return newElement;
        }
      );
      this.reOrderTable(transformList, ICategoryItemsInvestScreen.EARN);
    }

    if (category === ICategoryItemsInvestScreen.SPEND) {
      const transformList: IReOrderList[] = this.spendItems.map(
        (element, index) => {
          const newElement: IReOrderList = {
            uuid: element.uuid || '',
            order: index,
            category: element.category || 'SPEND',
          };
          return newElement;
        }
      );
      this.reOrderTable(transformList, ICategoryItemsInvestScreen.SPEND);
    }
  }

  ////.........................................................................................
  // DIALOG LOGIC
  createItemDialog(category: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen]): void {
    this.titleValue = "";
    this.linkValue = "";
    this.imageUrl = "";
    this.categoryValue = category;
    this.activateDialog = true;
  }

  editItemDialog(item: IinvestScreenItem) {
    this.idValue = item.uuid || '';
    (this.titleValue = item.title),
      (this.linkValue = item.link),
      (this.imageUrl = item.image);
    this.categoryValue = item.category || 'SPEND';

    // copy
    this.editItemCopy.uuid = item.uuid;
    this.editItemCopy.title = item.title;
    this.editItemCopy.link = item.link;
    this.editItemCopy.image = item.image;
    this.editItemCopy.category = item.category;

    this.isEdition = true;
    this.activateDialog = true;
  }

  editingDialogEvent(): void {
    if (!this.isEdition) {
      this.disabledSaveButton =
        this.titleValue === "" || this.linkValue === "" || this.imageUrl === "";
    } else {
      this.disabledSaveButton = !(
        this.titleValue !== this.editItemCopy.title ||
        this.linkValue !== this.editItemCopy.link ||
        this.imageUrl !== this.editItemCopy.image
      );
    }
  }

  hideDialog() {
    this.isEdition = false;
    this.activateDialog = false;
  }

  save() {
    this.isEdition ? this.editItem() : this.createItem();
    this.hideDialog();
  }

  ////........................................................................................
  // Generates body and blob to send to the api
  async checkUpload(data: IEmitFile) {
    this.uploadingImage = true;
    this.mimeType = data.file.type;
    this.fileName = data.file.name;

    const dataResource = await this.filesManager.dataResource(data);

    this.uploadResource(dataResource);
  }

  // Uploads resource to s3
  uploadResource(dataResource: IDataResource): void {
    this.filesApi
      .uploadResourceDynamic(
        dataResource,
        CBucketTypeSecurity.PUBLIC,
        "investScreen"
      )
      .subscribe({
        next: (response) => {
          this.imageUrl = response;
          this.uploadingImage = false;
          this.editingDialogEvent();
        },
        error: (error: HttpErrorResponse) => {
          this.errorsManager.manageErrors(error);
          this.uploadingImage = false;
        },
      });
  }

  removeResourceForm(): void {
    this.uploadedFiles = [];
    this.imageUrl = "";
  }
  ////........................................................................................
  // APIS:
  getItems(): void {
    this.investScreenApi.getItems().subscribe({
      next: (response) => {
        if(response.earn && response.earn.length){
          this.earnItems = response.earn;
          this.earnItemsCopy = [...this.earnItems];
        }
        if(response.spend && response.spend.length){
          this.spendItems = response.spend;
          this.spendItemsCopy = [...this.spendItems];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    });
  }

  createItem(): void {
    let item: IinvestScreenItem = {
      uuid: "",
      title: this.titleValue,
      link: this.linkValue,
      image: this.imageUrl,
      category: this.categoryValue,
      inactive: false,
    };

    this.investScreenApi.createItem(item).subscribe({
      next: (response) => {
        item.uuid = response.uuid;
        if (this.categoryValue === ICategoryItemsInvestScreen.EARN)
          this.earnItems = [...this.earnItems, item];
        if (this.categoryValue === ICategoryItemsInvestScreen.SPEND)
          this.spendItems = [...this.spendItems, item];
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    });
  }

  editItem(): void {
    const item: IinvestScreenItem = {
      uuid: this.idValue,
      title: this.titleValue,
      link: this.linkValue,
      image: this.imageUrl,
      category: this.categoryValue,
      inactive: false,
    };

    this.investScreenApi.updateItem(item).subscribe({
      next: (response) => {
        if (this.categoryValue === ICategoryItemsInvestScreen.EARN) {
          const index = this.earnItems.findIndex(
            (item) => item.uuid === response.uuid
          );
          this.earnItems[index] = response;
        }
        if (this.categoryValue === ICategoryItemsInvestScreen.SPEND) {
          const index = this.spendItems.findIndex(
            (item) => item.uuid === response.uuid
          );
          this.spendItems[index] = response;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    });
  }

  deleteItem(
    item: IinvestScreenItem,
    category: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen]
  ) {
    this.investScreenApi.deleteItem(item).subscribe({
      next: (response) => {
        if (category === ICategoryItemsInvestScreen.EARN) {
          this.earnItems = this.earnItems.filter(
            (item) => item.uuid !== response.uuid
          );
        }
        if (category === ICategoryItemsInvestScreen.SPEND) {
          this.spendItems = this.spendItems.filter(
            (item) => item.uuid !== response.uuid
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    });
  }

  reOrderTable(
    items: IReOrderList[],
    category: (typeof ICategoryItemsInvestScreen)[keyof typeof ICategoryItemsInvestScreen]
  ): void {
    this.investScreenApi.reOrderItems(items).subscribe({
      next: () => {
        if (category === ICategoryItemsInvestScreen.EARN)
          this.isReOrderEarn = false;
        if (category === ICategoryItemsInvestScreen.SPEND)
          this.isReOrderSpend = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error);
      },
    });
  }
}
