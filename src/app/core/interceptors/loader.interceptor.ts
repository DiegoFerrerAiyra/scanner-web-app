import { inject, Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { filter, finalize, Observable, tap } from "rxjs";
import {
  HIDE_SPINNER,
  NO_INTERCEPTORS,
} from "./constants/interceptors.constants";
import { LoaderService } from "@shared/components/dumb/spinner/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  private readonly loaderService:LoaderService = inject(LoaderService)

  count: number = 0;

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {

    // hide spinner for this request
    if (request.context.get(HIDE_SPINNER) === true || request.context.get(NO_INTERCEPTORS) === true) {
      return next.handle(request);
    }

    this.count++;
    return next.handle(request).pipe(
      tap(() => this.show()),
      filter((event) => event instanceof HttpResponse),
      finalize(() => {
        this.count--;
        this.count == 0 && this.hide();
      })
    );
  }

  private show() {
    this.loaderService.show();
  }

  private hide() {
    this.loaderService.hide();
  }
}
