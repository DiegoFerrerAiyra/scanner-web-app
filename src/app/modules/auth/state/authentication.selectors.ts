import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITokensUser } from 'src/app/modules/auth/models/interfaces/auth.interfaces';
import { UserState } from 'src/app/modules/auth/state/authentication.reducer';


export const selectAuthState = createFeatureSelector<UserState>('authentication');
export const selectUser = createSelector(selectAuthState,(state: UserState) => state.user);
export const selectToken = createSelector(selectAuthState,(state: UserState) => state?.user?.accessToken);
export const selectRoles = createSelector(selectAuthState,(state: UserState) => state?.user?.roles);
export const selectAllTokens = createSelector(selectAuthState,(state: UserState) => {
    const tokens:ITokensUser = {
        accessToken : state?.user?.accessToken || '',
        refreshToken : state?.user?.refreshToken || ''
    }
    return tokens
});

