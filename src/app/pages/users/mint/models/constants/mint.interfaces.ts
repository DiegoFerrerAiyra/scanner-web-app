import { StatusTypes } from './mint.types';
export interface IFileItem{
    user_id:string
    amount :number
    concept_id :string
    currency :'MBX'
    status:typeof StatusTypes[keyof typeof StatusTypes]
    errorMessage?:string
}