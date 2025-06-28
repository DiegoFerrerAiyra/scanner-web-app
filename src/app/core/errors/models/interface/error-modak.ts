import { INewErrorBodyModak } from "@core/errors/models/interface/errors.interface";
export class NewErrorModak {
    errors:NewErrorBodyModak[];

    constructor(error:INewErrorBodyModak){
        this.errors = [new NewErrorBodyModak(error)]
    }
}

export class NewErrorBodyModak{
    code :string;
    message:string = ''
    summary?:string;

    constructor(error:INewErrorBodyModak){
        this.code = error.code;
        this.message = error.message
        if(error.summary){
            this.summary = error.summary
        }
    }
}
