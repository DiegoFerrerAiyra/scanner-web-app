import { authActions } from '@modules/auth/state/authentication.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { IUser } from 'src/app/modules/auth/models/interfaces/auth.interfaces';
import { AuthState, UserState } from './auth.state';


const _authenticationReducer = createReducer(UserState,

    // user Actions
    on(authActions.setUser, (state, {authentication}) => ({ ...state, user: {...authentication}})),
    on(authActions.unSetUser, state => ({ ...state, user: UserState.user})),
    on(authActions.setAccessToken, (state,action) => ({ ...state, user: {...state.user,accessToken : action.token}})),
    on(authActions.setNewRoles, (state,action) => ({ ...state, user: {...state.user,roles : action.roles}})),
    on(authActions.refreshAccessToken, (state,action) => ({ ...state, user: {...state.user,accessToken : action.newToken}}))
);

export function authenticationReducer(state: AuthState | undefined, action: Action) {
    return _authenticationReducer(state, action);
}