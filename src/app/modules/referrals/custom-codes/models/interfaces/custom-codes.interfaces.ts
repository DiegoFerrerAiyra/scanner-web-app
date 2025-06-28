export interface ICustomCodes {
    code: string,
    reward_id: string,
}

export interface ICreateCustomCodeRequest {
    code: string,
    reward_id: string,
    referrer_id: string,
}