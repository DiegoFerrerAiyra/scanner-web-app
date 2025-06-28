import { inject, Injectable } from '@angular/core';
import { IDataResource, IResourcesS3 } from '@core/files/models/interfaces/resource.interface';
import { IEmitFile } from '@shared/components/dumb/file-upload/models/interfaces/file-upload.interfaces';
import { CryptoFunctions } from '@shared/utils/crypto.functions';


@Injectable({
  providedIn: 'root'
})
export class FilesManager {

  private readonly criptoFunctions:CryptoFunctions = inject(CryptoFunctions)

  async dataResource(data: IEmitFile):Promise<IDataResource>{

    const hash = await this.criptoFunctions.getMHash(data.file)
    const blob = new Blob([data.file], { type: data.file.type });

    const body:IResourcesS3 = {
      md5: hash,
      type: data.file.type,
      name: data.file.name,
    }
    const dataResource:IDataResource = {
      hash,
      body,
      blob,
      fileName:data.file.name
    }

    return dataResource
  }
}
