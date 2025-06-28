export interface IErrorBodyModak {
    code:string,
    message:string,
    cause:string
}

export interface INewErrorBodyModak {
    code:string,
    message:string,
    summary?:string
}