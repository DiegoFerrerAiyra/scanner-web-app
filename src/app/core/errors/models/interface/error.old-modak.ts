export class ErrorModak {
    error:ErrorBodyModak;

    constructor(code:string){
        this.error = new ErrorBodyModak(code)
    }
}

export class ErrorBodyModak{
    code :string;
    message:string = 'Custom Error'
    cause:string = 'custom'

    constructor(code:string){
        this.code = code;
    }
}