import { ICategoryItemsInvestScreen } from '../constants/invest-screen.constants';
export interface IinvestScreenItem{
    uuid?:string,
    title:string,
    link:string,
    image:string,
    order?:number
    category?: typeof ICategoryItemsInvestScreen[keyof typeof ICategoryItemsInvestScreen],
    inactive:boolean
}

export interface IGetInvestScreenItems{
    earn: IinvestScreenItem[],
    spend: IinvestScreenItem[]
}

export interface IDeleteItemInvestResponse{
    uuid:string
}

export interface IReOrderList {
    uuid:string,
    order:number,
    category: typeof ICategoryItemsInvestScreen[keyof typeof ICategoryItemsInvestScreen]
}