import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, mergeMap, map } from 'rxjs';

import { HIDE_SPINNER, NO_INTERCEPTORS } from '../interceptors/constants/interceptors.constants';
import { CBucketTypeSecurity } from './models/constants/files.constants';
import { IDataResource, IGetUrl } from '@core/files/models/interfaces/resource.interface';

@Injectable({
  providedIn: 'root'
})
export class FilesApi {

   private readonly http:HttpClient = inject(HttpClient)

   private MONOLITH_URL: string = environment.APIS.MONOLITH_URL;

  uploadResourceDynamic(dataResource:IDataResource,pathSecurity:typeof CBucketTypeSecurity[keyof typeof CBucketTypeSecurity] ,resourcePathName:string): Observable<string>{
    const hash = dataResource.hash
    const body = dataResource.body
    const resource = dataResource.blob
    const fileName = dataResource.fileName

    // Options for Request
    const options = {
      context: new HttpContext().set(HIDE_SPINNER, true)
    }

    let resourceUrl:string = ''

    return this.http.post<IGetUrl>(`${this.MONOLITH_URL}/resources/${pathSecurity}/${resourcePathName}`, body,options).pipe(
    tap((response:IGetUrl) => resourceUrl = response.resource_url),
    mergeMap((response:IGetUrl) => this.putResource(response.put_url,resource,hash, fileName)),
    map(() => resourceUrl)
    )
  }

  putResource(url:string,video:Blob, hash:string, fileName: string): Observable<any>{

    const options = {
      headers: {
        'X-Amz-Acl': 'public-read',
        'X-Amz-Meta-Name': fileName,
        'Content-MD5': hash,
      },
      context: new HttpContext().set(NO_INTERCEPTORS, true)
    }
    return this.http.put<string>(url, video, options)
  }
}
