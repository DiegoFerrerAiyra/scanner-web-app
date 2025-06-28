import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRateLimit } from '@modules/discord/rate-limits/models/interface/rate-limit.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class RateLimitsApi {

  private MONOLITH_URL: string = environment.APIS.MONOLITH_URL;

  private readonly http:HttpClient = inject(HttpClient)

  getRateLimits():Observable<IRateLimit[]>{
    return this.http.get<IRateLimit[]>(`${this.MONOLITH_URL}/ratelimits`)
  }

  getRateLimit(id:string):Observable<IRateLimit>{
    return this.http.get<IRateLimit>(`${this.MONOLITH_URL}/ratelimits/${id}`)
  }

  createRateLimit(rateLimit:IRateLimit):Observable<IRateLimit>{
    return this.http.post<IRateLimit>(`${this.MONOLITH_URL}/ratelimits/`,rateLimit)
  }

  updateRateLimit(rateLimit:IRateLimit):Observable<IRateLimit>{
    return this.http.put<IRateLimit>(`${this.MONOLITH_URL}/ratelimits/${rateLimit.uuid}`,rateLimit)
  }

  deleteRateLimit(id:string):Observable<IRateLimit>{
    return this.http.delete<IRateLimit>(`${this.MONOLITH_URL}/ratelimits/${id}`)
  }
}
