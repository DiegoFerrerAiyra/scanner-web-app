import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITokensUser } from 'src/app/modules/auth/models/interfaces/auth.interfaces';
import { AuthState } from './auth.state';



export const selectAuthState = createFeatureSelector<AuthState>('authentication');
export const selectUser = createSelector(selectAuthState,(state: AuthState) => state.user);
export const selectToken = createSelector(selectAuthState,(state: AuthState) => state?.user?.accessToken);
export const selectRoles = createSelector(selectAuthState,(state: AuthState) => state?.user?.roles);
export const selectAllTokens = createSelector(selectAuthState,(state: AuthState) => {
    const tokens:ITokensUser = {
        accessToken : state?.user?.accessToken || '',
        refreshToken : state?.user?.refreshToken || ''
    }
    return tokens
});

