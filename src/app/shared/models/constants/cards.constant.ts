export const MO_CARDS_VALUES = {
    NoTheme: 'no_theme',
    MoRiginal: 'mo_faces',
    MoGogh: 'mo_gogh',
    MoAitopia: 'mo_flow',
    MoDoodle: 'mo_stickers',
} as const

export const MO_CARDS_LABELS = {
    [MO_CARDS_VALUES.NoTheme]: 'Default Theme',
    [MO_CARDS_VALUES.MoRiginal]: 'Mo Faces / MoRiginal',
    [MO_CARDS_VALUES.MoGogh]: 'Mo Gogh / MoGogh',
    [MO_CARDS_VALUES.MoAitopia]: "Mo Flow / MoAitopia",
    [MO_CARDS_VALUES.MoDoodle]: "Mo Stickers / MoDoodle",
} as const

export const LIST_MO_CARDS = Object.entries(MO_CARDS_LABELS).map(([value, label]) => ({ label, value }))

export const CARD_TYPES = {
    VIRTUAL: 'virtual',
    PHYSICAL: 'physical'
}

export const CARD_TYPES_LABEL = {
    [CARD_TYPES.VIRTUAL]: 'virtual card',
    [CARD_TYPES.PHYSICAL]: 'physical card'
}

export const CARD_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pendingActivation',
    CANCELLED: 'cancelled',
    INACTIVE: 'inactive',
}

export const CARD_STATUS_LABEL = {
    [CARD_STATUS.ACTIVE]: 'active',
    [CARD_STATUS.PENDING]: 'pending',
    [CARD_STATUS.CANCELLED]: 'cancelled',
    [CARD_STATUS.INACTIVE]: 'inactive',
}