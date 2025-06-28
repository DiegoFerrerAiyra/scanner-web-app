export type StatusType = 'pending' | 'success' | 'error';

export const StatusTypes = {
    PENDING: 'pending' as StatusType,
    SUCCESS: 'success' as StatusType,
    ERROR: 'error' as StatusType,
  } as const;