import { Roles } from "@core/roles/models/types/roles.types";

export interface IUser{
    name:string,
    email:string,
    accessToken:string,
    refreshToken:string,
    roles: Roles[]
}

export interface ITokenDecoded{
    at_hash:               string;
    sub:                   string;
    "cognito:groups":      string[];
    email_verified:        boolean;
    iss:                   string;
    phone_number_verified: boolean;
    "cognito:username":    string;
    given_name:            string;
    origin_jti:            string;
    aud:                   string;
    identities:            Identity[];
    token_use:             string;
    auth_time:             number;
    exp:                   number;
    iat:                   number;
    family_name:           string;
    jti:                   string;
    email:                 string;
    "custom:role":         string;
}

export interface Identity {
    userId:       string;
    providerName: string;
    providerType: string;
    issuer:       null;
    primary:      string;
    dateCreated:  string;
}

export interface ICheckInvalidInput{
    firstNameInput:boolean,
    lastNameInput:boolean
    emailInput:boolean
}

export interface IUserState {
    authentication:{
        user:IUser
    }
}
export interface ITokensUser{
    accessToken:string,
    refreshToken:string
}

export interface IAuthDataState {
    user: IUser
}