import { authActions } from '@modules/auth/state/authentication.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { IUser } from 'src/app/modules/auth/models/interfaces/auth.interfaces';


export interface UserState {
    user: IUser;
  }

  export const initialState: UserState = {
    user:{
        name:'',
        email:'',
        accessToken:'',
        refreshToken:'',
        roles:[]
    },
  };

const _authenticationReducer = createReducer(initialState,

    // user Actions
    on(authActions.setUser, (state, {authentication}) => ({ ...state, user: {...authentication}})),
    on(authActions.unSetUser, state => ({ ...state, user: initialState.user})),
    on(authActions.setAccessToken, (state,action) => ({ ...state, user: {...state.user,accessToken : action.token}})),
    on(authActions.setNewRoles, (state,action) => ({ ...state, user: {...state.user,roles : action.roles}})),
    on(authActions.refreshAccessToken, (state,action) => ({ ...state, user: {...state.user,accessToken : action.newToken}}))
);

export function authenticationReducer(state: UserState | undefined, action: Action) {
    return _authenticationReducer(state, action);
}