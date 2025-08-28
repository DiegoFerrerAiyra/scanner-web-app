import { IUser } from "../models/interfaces/auth.interfaces";

export interface AuthState {
    user: IUser;
  }

  export const UserState: AuthState = {
    user:{
        name:'',
        email:'',
        accessToken:'',
        refreshToken:'',
        roles:[]
    },
  };