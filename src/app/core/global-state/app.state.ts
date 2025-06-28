import { ActionReducerMap } from '@ngrx/store';
import * as authenticationReducer from '../../modules/auth/state/authentication.reducer';

// Global App Reducers
import * as loaderReducer from './reducers/loader/loader.reducer';
import * as responsiveReducer from './reducers/responsive/responsive.reducer';

export interface GlobalState {
    loader: loaderReducer.LoaderState
    responsive: responsiveReducer.ResponsiveState
    authentication: authenticationReducer.UserState
}

export const appReducers: ActionReducerMap<GlobalState> = {
    loader: loaderReducer.loaderReducer,
    responsive: responsiveReducer.responsiveReducer,
    authentication: authenticationReducer.authenticationReducer
}