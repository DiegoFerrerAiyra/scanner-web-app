import { MetaReducer } from "@ngrx/store";
import { clearState } from "src/app/core/global-state/reducers/clear/clearState.reducer";
import { localStorageSyncReducer } from "../ngrx";

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, clearState];