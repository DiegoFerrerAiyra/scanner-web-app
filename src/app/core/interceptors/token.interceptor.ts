import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContext
} from '@angular/common/http';
import { catchError, from, lastValueFrom, Observable, throwError } from 'rxjs';
import { NO_INSERT_TOKEN, NO_INTERCEPTORS, NO_VERIFY_UNAUTHORIZE } from './constants/interceptors.constants';
import { AuthService } from '@modules/auth/auth.service';
import { WafProtectionService } from '@core/services/waf-protection/waf-protection.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly authService:AuthService = inject(AuthService)
  private readonly wafProtectionService: WafProtectionService = inject(WafProtectionService)

  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{

    // No insert Token
    if(this.useNotInterceptor(request.context)) {
      return next.handle(request);
    }

    if(this.validateUnauthorizedError(request.context)) {
      return from(this.handle(request, next))
    }

    return from(this.handle(request, next)).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    )
  }

  async handle(request: HttpRequest<any>, next: HttpHandler){

    const token = await this.authService.getToken()

    if(!token) return lastValueFrom(next.handle(request));

    request = this.createRequestWithJWT(request, token);

    if (this.wafProtectionService.allowWafTokenModakUrl(request)) {
      const awsToken = await this.wafProtectionService.getToken();
      if (awsToken) {
        request = this.wafProtectionService.createRequestWithAwsToken(request,awsToken);
      }
    }

    return lastValueFrom(next.handle(request))
  }

  private createRequestWithJWT(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  private useNotInterceptor(ctx: HttpContext): boolean {
    if(ctx.get(NO_INSERT_TOKEN) === true || ctx.get(NO_INTERCEPTORS) === true) {
      return true;
    }

    return false
  }

  private validateUnauthorizedError(ctx: HttpContext): boolean {
    return ctx.get(NO_VERIFY_UNAUTHORIZE) === true
  }
}
