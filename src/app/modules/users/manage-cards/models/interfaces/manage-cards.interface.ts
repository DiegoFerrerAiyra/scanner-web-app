export interface IFetchCardsPayload {}

export interface IFetchCardsResponse {
    list_cards: IFetchCard[]
}

export interface IFetchCard {
    theme: string
    id: string,
    type: string, //physical or virtual
    status: string,
    bin_type: string, //debit or credit
    is_block_by_parent?: boolean
}

export interface IDeleteCardPayload {
    user_id: string
    card_id: string
}

export interface IDeleteCardResponse {
    id: string
    cardStatus: string
}

export interface ReplaceCardPayload {
    modakUserId: string
    cardId: string
    reason: string
}

export interface ICardReplaceResponse {
    card_id: string
}