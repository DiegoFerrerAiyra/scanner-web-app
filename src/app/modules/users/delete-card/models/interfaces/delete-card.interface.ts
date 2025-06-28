export interface IDeleteCardPayload {
    modakUserId: string
    cardId: string
}

export interface IDeleteCardApiPayload {
    card_id: string
    user_id: string
}


export interface IDeleteCardResponse {
    id: string
    cardStatus: string
}

export interface IListCardsResponse {
    list_cards: string[]
}