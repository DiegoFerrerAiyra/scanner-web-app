export interface IResource{
    video:FormData,
}

export class IRemoveFile{
    constructor(){}
    clear(){}
}

export interface IResourcesS3{
    md5: string,
    type: string,
    name: string,
}

export interface IDataResource {
    hash:string,
    body:IResourcesS3,
    blob:Blob,
    fileName:string
}

export interface IGetUrl {
    put_url:string,
    resource_url:string
}