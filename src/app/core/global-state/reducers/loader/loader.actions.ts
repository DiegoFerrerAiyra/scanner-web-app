import { createAction } from '@ngrx/store';

export const loaderActions = {
  isLoading: createAction('[SPINNER Component] Is Loading'),
  stopLoading: createAction('[SPINNER Component] Stop Loading')
};
