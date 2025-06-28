import { createAction,props } from '@ngrx/store';
import { IUser } from 'src/app/modules/auth/models/interfaces/auth.interfaces';

export const authActions = {
    setUser : createAction('[Authentication] setUser',props<{authentication:IUser}>()),
    unSetUser : createAction('[Authentication] unSetUser'),
    setAccessToken : createAction('[Authentication] setAccessToken',props<{token:string}>()),
    setNewRoles : createAction('[Authentication] setNewRoles',props<{roles:string[]}>()),
    refreshAccessToken : createAction('[Authentication] refreshAccessToken',props<{newToken:string}>())
  };