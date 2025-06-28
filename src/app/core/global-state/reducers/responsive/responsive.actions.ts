import { createAction } from '@ngrx/store';

export const isMobile       = createAction('[EVENT RESIZE] is Mobile');
export const isDesktop      = createAction('[EVENT RESIZE] Is Desktop');