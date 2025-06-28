import { HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { C_WAF_PROTECTION } from '@core/services/waf-protection/models/constants/waf-protection.constants';
import { AppFunctions } from '@shared/utils/app.functions';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, filter, from, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var AwsWafIntegration: any;

@Injectable({
  providedIn: 'root'
})
export class WafProtectionService {

  private readonly appFunctions: AppFunctions = inject(AppFunctions);
  private readonly cookieService: CookieService = inject(CookieService);

  private countWafError: number = 0;
  private isProd: boolean = environment.production;

  private scriptLoadedSubject = new BehaviorSubject<boolean>(false);
  private scriptLoaded$ = this.scriptLoadedSubject.asObservable();

  public loadScript(): void {
    const src = `https://${environment.WAF.IDENTIFIER}.${environment.WAF.REGION}.sdk.awswaf.com/${environment.WAF.IDENTIFIER}/${environment.WAF.TOKEN}/challenge.js`
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      
      this.scriptLoadedSubject.next(true);
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.defer = true;

    script.onload = () => {
      this.scriptLoadedSubject.next(true);
    };

    script.onerror = () => {
      // eslint-disable-next-line no-console
      console.error('Error loading AWS WAF script.');
      this.scriptLoadedSubject.next(false);
    };

    document.head.appendChild(script);
    
  }
  
  public getWafToken(): Observable<string> {
    return this.scriptLoaded$.pipe(
      filter(loaded => loaded === true),
      switchMap(() => {
        if (typeof AwsWafIntegration !== 'undefined' && AwsWafIntegration) {
          return from(AwsWafIntegration.getToken()).pipe(
            switchMap((token: string) => {
              if (token) {
                return of(token);
              }
              return of(this.getTokenFromCookie());
            }),
            catchError(() => {
              return of(this.getTokenFromCookie());
            })
          );
        }
        return of(this.getTokenFromCookie());
      }),
      catchError(() => {
        return of(this.getTokenFromCookie());
      })
    );
  }

  public async getToken(): Promise<string> {
    if (typeof AwsWafIntegration !== 'undefined' && AwsWafIntegration) {
      try {
        const awsToken = await AwsWafIntegration.getToken();
        if (awsToken) {
          return awsToken;
        }
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
    return this.getTokenFromCookie()
  }

  private getTokenFromCookie(): string {
    return this.cookieService.get(C_WAF_PROTECTION.COOKIE_AWS_WAF_TOKEN)
  }

  public incrementWafCount(): void {
    this.countWafError++;
  }

  public resetWafCount(): void {
    this.countWafError = 0;
  }

  public getCountError(): number {
    return this.countWafError;
  }

  public allowWafTokenModakUrl(request: HttpRequest<any>): boolean {
    if(this.isMonolith(request)) return false;
    return request.url.includes(C_WAF_PROTECTION.MODAK_URL)
  }

  private isMonolith(request: HttpRequest<any>): boolean {
    return request.url.startsWith('https://api.');
  }

  public createRequestWithAwsToken(
    request: HttpRequest<any>, 
    awsToken: string
  ): HttpRequest<any> {
    return request.clone({
        setHeaders: {
            'x-aws-waf-token': awsToken
        }
    });
  }

  public createRequestForSkipWaf(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
        setHeaders: {
            'x-modak-skip-waf': environment.WAF.SKIP_KEY
        }
    });
  }

  public canSkipWaf(request: HttpRequest<any>): boolean {
    if(this.isProd) return false;
    return this.allowWafTokenModakUrl(request) && this.appFunctions.isLocalhost()
  }

  //NEXT_PR: When backend expose headers to read, Check header x-amzn-waf-action with value 'challenge' and x-modak-waf in true
  public isChallenge(request: HttpRequest<any>, response: HttpResponse<any>): boolean {
    return this.allowWafTokenModakUrl(request) && response.status === HttpStatusCode.Accepted
  }

  private isChallengeAction(response: HttpResponse<any>): boolean {
    return response.headers.get(C_WAF_PROTECTION.HEADERS.ACTION.KEY) === C_WAF_PROTECTION.HEADERS.ACTION.VALUES.CHALLENGE
  }

  private isModakWaf(response: HttpResponse<any>): boolean {
    return response.headers.get(C_WAF_PROTECTION.HEADERS.MODAK_WAF.KEY) === C_WAF_PROTECTION.HEADERS.MODAK_WAF.VALUES.TRUE
  }
}
