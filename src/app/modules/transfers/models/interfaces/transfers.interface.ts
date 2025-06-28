export interface ITransferToModakPayload {
    userId: string,
    amount: string,
    description:string;
}

export interface ITransferToModakApiPayload {
    user_id: string,
    amount: string,
    description:string
}

export interface ITransferToModakResponse {
    transfer_id: string
}

export interface ITransferToUserPayload {
    modakUserId: string,
    amount: string,
    description:string
}

export interface ITransferToUserApiPayload {
    modak_user_id: string,
    amount: string,
    description:string
}

export interface ITransferToUserResponse {
    transfer_id: string
}