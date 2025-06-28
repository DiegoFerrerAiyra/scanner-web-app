export const IntervalType = {
    ABSOLUTE: 'ABSOLUTE',
    RELATIVE: 'RELATIVE',
} as const;

export const DurationNanosecond = 1;
export const DurationMicrosecond = DurationNanosecond * 1000;
export const DurationMillisecond = DurationMicrosecond * 1000;
export const DurationSecond = DurationMillisecond * 1000;
export const DurationMinute = 60 * DurationSecond;
export const DurationHour = 60 * DurationMinute