export const DiscordStatus = {
    CONNECTED: 'CONNECTED',
    PENDING: 'PENDING',
} as const;

export const IdentityStatus = {
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
} as const;

export const IdentityTypeVerification = {
    YOTI: 'YOTI',
    MANUAL: 'MANUAL',
    PENDING:'PENDING'
} as const;

export const IYotiSessionsStatus = {
    PENDING:'PENDING',
    IN_PROGRESS:'IN_PROGRESS',
    FAIL:'FAIL',
    COMPLETE:'COMPLETE',
    ERROR:'ERROR',
    CANCELLED:'CANCELLED',
}

export const IYotiSessionsType = {
    AGE:'AGE',
    OVER:'OVER',
    UNDER:'UNDER',
}