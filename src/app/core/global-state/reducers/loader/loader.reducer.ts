import { loaderActions } from '@core/global-state/reducers/loader/loader.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface LoaderState {
    isLoading: boolean; 
}

export const initialState: LoaderState = {
   isLoading: false,
}

const _loaderReducer = createReducer(initialState,

    on(loaderActions.isLoading,   state => ({ ...state, isLoading: true})),
    on(loaderActions.stopLoading, state => ({ ...state, isLoading: false})),

);

export function loaderReducer(state: LoaderState | undefined, action: Action) {
    return _loaderReducer(state, action);
}