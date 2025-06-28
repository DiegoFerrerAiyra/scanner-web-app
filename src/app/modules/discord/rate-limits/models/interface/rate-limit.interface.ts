export interface IRateLimit{
    uuid:string,
    name:string,
    limit_calls:number,
    interval:IRateLimitInterval,
    inactive:boolean,
    created?:string,
    updated?:string,
    status?:string
}

export interface IRateLimitInterval {
    is_relative:boolean,
    relative?:number,   
    absolute?:IRateLimitIntervalAbsolute
}

export interface IRateLimitIntervalAbsolute {
    start?:string,
    end?:string
}

export const RecordStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
}