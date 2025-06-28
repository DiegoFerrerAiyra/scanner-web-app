import { Injectable } from '@angular/core';
import { VideoAttributes } from '@core/files/models/constants/files.constants';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoFunctions {


  // Generates video hash
  async getMHash(file: File):Promise<any>{

    const sliceSize = VideoAttributes.CHUNK_SIZE;
    let start = 0;

    let md5 = CryptoJS.algo.MD5.create()

    while (start < file.size) {
      const slice: any = await this.readSlice(file, start, sliceSize);

      const wordArray = CryptoJS.lib.WordArray.create(slice);
      md5 = md5.update(wordArray)    
      start += sliceSize;
    }

    md5.finalize()

    return md5['_hash'].toString(CryptoJS.enc.Base64);
  }

   // Slices the video to be able to hash it
   private async readSlice(file: File, start: number, size: number): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);

      fileReader.onload = () => resolve(new Uint8Array(fileReader.result as any));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(slice);
    });
  }
}
