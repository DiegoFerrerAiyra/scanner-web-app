import { Injectable, inject } from "@angular/core";

import { Papa } from "ngx-papaparse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CsvManager {
  //#region [---- DEPENDENCIES ----]
  private papa: Papa = inject(Papa);

  //#endregion

  public parseCsv(file: File): Observable<any> {
    return new Observable((observer) => {
      this.papa.parse(file, {
        header: true,
        complete: (result) => {
          observer.next(result.data);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  public downloadCsv(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
