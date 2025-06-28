import { HttpClient } from "@angular/common/http";
import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MintApi } from "@modules/users/mint/mint.api";
import { CsvManager } from "@shared/services/csv-manager/csv-manager";
import {
  from,
  tap,
  filter,
  mergeMap,
  map,
  catchError,
  EMPTY,
  debounceTime,
  distinctUntilChanged,
  first,
  of,
  Subscription,
  finalize,
} from "rxjs";
import {
  CSV_FILENAME,
  CSV_MINT_HEADER,
  CSV_MINT_HEADER_WITH_ERROR,
  CSV_TEMPLATE_PATH,
  MAX_CONCURRENCE_REQUEST,
  SEARCH_DEBOUNCE_TIME
} from "./models/constants/mint.constants";
import { StatusTypes } from "./models/constants/mint.types";
import { IFileItem } from "./models/constants/mint.interfaces";
import { Papa } from "ngx-papaparse";
import { FileUpload } from "primeng/fileupload";
import { formatDate } from '@angular/common';


@Component({
  selector: "mdk-mint",
  templateUrl: "./mint.page.html",
  styleUrls: ["./mint.page.scss"],
})
export class MintComponent implements OnInit, OnDestroy {
  //#region [---- DEPENDENCIES ----]
  private readonly mintApi: MintApi = inject(MintApi);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly csvManager: CsvManager = inject(CsvManager);
  private readonly papa: Papa = inject(Papa);
  //#endregion

  //#region [---- PROPERTIES ----]
  public total: number = 0;
  public success: number = 0;
  public errors: number = 0;
  public filteredList: IFileItem[] = [];
  private originalList: IFileItem[] = [];
  public searchValue: FormControl = new FormControl("");
  private sub$: Subscription = new Subscription();
  public disableButton: boolean = false;
  @ViewChild("fileUpload") fileUpload!: FileUpload;
  //#endregion

  //#region [---- LIFE HOOKS ----]

  ngOnInit(): void {
    this.searchById();
  }
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
    this.resetFileInput();
  }
  //#endregion

  //#region [---- LOGIC ----]

  private searchById(): void {
    this.sub$.add(
      this.searchValue.valueChanges
        .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
        .subscribe((value) => {
          this.filterData(value);
        })
    );
  }
  public downloadTemplateFile(): void {
    this.sub$.add(
      this.http
        .get(CSV_TEMPLATE_PATH, { responseType: "blob" })
        .pipe(first())
        .subscribe((response: Blob) => {
          const url = URL.createObjectURL(response);
          const link = document.createElement("a");
          link.href = url;
          link.download = CSV_FILENAME;
          link.click();
          URL.revokeObjectURL(url);
        })
    );
  }

  public onFileChange({ currentFiles }: { currentFiles: File[] }): void {
    this.resetFileInput();
    const file = currentFiles[0];
    if (file) {
      this.sub$.add(
        this.csvManager
          .parseCsv(file)
          .pipe(
            filter((data) => data?.length > 0),
            tap((data) => (this.total = data.length)),
            map((data) => {
              return data.map((item) => {
                return {
                  user_id: item.user_id,
                  amount: +item.amount,
                  currency: item.currency,
                  concept_id: item.reason,
                  status: StatusTypes.PENDING,
                };
              });
            }),
            tap((data: IFileItem[]) => {
              this.originalList = data;
              this.filteredList = data;
            })
          )
          .subscribe()
      );
    }
  }

  public submitFile(): void {
    this.sub$.add(
      from(this.originalList)
        .pipe(
          mergeMap(
            (item: IFileItem) =>
              this.mintApi.mintImportUpload(item).pipe(
                tap(() => {
                  item.status = StatusTypes.SUCCESS;
                  this.success++;
                }),
                catchError((err) => {
                  const messageError =
                    err?.error?.errors[0]?.message ?? err?.message;
                  item.status = StatusTypes.ERROR;
                  item.errorMessage = messageError;
                  this.errors++;
                  return EMPTY;
                })
              ),
            MAX_CONCURRENCE_REQUEST
          ),
          finalize(() => (this.disableButton = true))
        )
        .subscribe()
    );
  }
  private filterData(searchTerm: string) :void {
    if (searchTerm) {
      this.filteredList = [
        this.originalList.find((item) =>
          item.user_id.toString().includes(searchTerm)
        ),
      ];
      return;
    }
    this.filteredList = this.originalList;
  }
  public downloadCsvSuccess(): void {
    const successData = this.originalList.filter(
      (item) => item.status === StatusTypes.SUCCESS
    );
    const successCsv = this.papa.unparse({
      fields: CSV_MINT_HEADER,
      data: successData.map((item) => [
        item.user_id,
        item.amount,
        item.currency,
        item.concept_id,
      ]),
    });
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yy/MM/dd', 'en-US');
    const fileName = `${formattedDate}_Success.csv`;
    this.csvManager.downloadCsv(fileName, successCsv);
  }

  public downloadCsvErrors(): void {
    const errorData = this.originalList.filter(
      (item) => item.status === StatusTypes.ERROR
    );
    const errorCsv = this.papa.unparse({
      fields: CSV_MINT_HEADER_WITH_ERROR,
      data: errorData.map((item) => [
        item.user_id,
        item.amount,
        item.currency,
        item.concept_id,
        item?.errorMessage,
      ]),
    });
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yy/MM/dd', 'en-US');
    const fileName = `${formattedDate}_Errors.csv`;
    this.csvManager.downloadCsv(fileName, errorCsv);
  }

  private resetFileInput(): void {
    if (this.fileUpload) {
      this.disableButton = false;
      this.originalList = [];
      this.filteredList = [];
      this.success = 0;
      this.errors = 0;
      this.fileUpload.clear();
    }
  }
}

//#endregion
