import { IAchievementProof } from './api.interfaces';
export interface IAchievementsItem {
    id:string,
    name:string,
    miniDescription:string,
    bigDescription:string,
    icon:string,
    link:string,
    visibility:boolean,
    contributes:boolean,
    MBXRewards:number,
    pointsRewards:number,
    startDate:Date,
    endDate:Date,
    conditions:string,
    proof:IAchievementProof,
    automaticPayment:boolean,
    annoucementNotificationTitle:string,
    annoucementNotificationDescription:string,
    finishedNotificationTitle:string,
    finishedNotificationDescription:string
}

export interface ICategory {
    uuid:string,
    name:string,
    discord_command_name?:string,
    description?:string,
    rule_uuid?:string,
    range_amount?: ICategoryRangeAmount
    inactive:boolean,
    created?:string,
    updated?:string,
    rule_name?:string
    status?:string
}

export interface ICategoryRangeAmount {
    minimum?: number,
    maximum?: number
}

