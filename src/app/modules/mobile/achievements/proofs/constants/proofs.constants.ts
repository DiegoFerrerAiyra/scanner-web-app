export const CProofStatusApi = {
    SUBMITTED: 'SUBMITTED',
    REVIEW: 'REVIEW',
    DISMISSED: 'DISMISSED',
    BURNT: 'BURNT',
    PAYED: 'PAYED',
    APPROVED: 'APPROVED',
    AUTO_APPROVED: 'AUTO_APPROVED'
} as const;

export const CProofStatus = {
    SUBMITTED: 'Submitted',
    REVIEW: 'In Review',
    DISMISSED: 'Cancelled',
    BURNT: 'Burnt',
    PAYED: 'Payed',
    APPROVED: 'Approved',
    AUTO_APPROVED: 'Auto Approved'
} as const;