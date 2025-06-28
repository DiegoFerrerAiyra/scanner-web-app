import { HttpContextToken } from "@angular/common/http";

export const HIDE_SPINNER           = new HttpContextToken<boolean>(() => false);
export const NO_INSERT_TOKEN        = new HttpContextToken<boolean>(() => false);
export const NO_INTERCEPTORS        = new HttpContextToken<boolean>(() => false);
export const NO_VERIFY_UNAUTHORIZE  = new HttpContextToken<boolean>(() => false);