import { AccountStatus, BankAccountStatus } from "@pages/users/search-users/models/types/accountStatus.types";
import {
  DiscordStatus,
  IdentityStatus,
  IdentityTypeVerification,
  IYotiSessionsType,
  IYotiSessionsStatus,
} from "../constants/status.constants";

export interface IQueryParamsAccepted {
  phone: string;
  email: string;
  modak_id: string;
}

export interface ISearchUserResponse {
  uuid: string;
  discord_data: IUserDiscordData;
  age_verification_data: IUserAgeVerificationData;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  closed_at: string;
  web3_address: string;
  yoti_sessions: IUserYotiSessionsDataResponse[];
  roles?: string[];
  mbx_balance?: string;
  deletion_status: AccountStatus;
  bank_account_status?: BankAccountStatus;
}

export interface IUserDiscordData {
  username: string;
  id: string;
  VerifiedAt: string;
  created_at: string;
  discriminator: string;
}

export interface IUserAgeVerificationData {
  type: (typeof IdentityTypeVerification)[keyof typeof IdentityTypeVerification];
  verified: boolean;
  VerifiedAt: string;
  session_id: string;
  admin_user_uuid: string;
}

export interface IUserYotiSessionsDataResponse {
  id: string;
  user_uuid: string;
  created: string;
  expires_at: string;
  updated: string;
  status: (typeof IYotiSessionsStatus)[keyof typeof IYotiSessionsStatus];
  type: (typeof IYotiSessionsType)[keyof typeof IYotiSessionsType];
}

export interface IUserYotiSessionsDataTable {
  created: string;
  status: string;
  type: string;
}

export interface IUsersForTable {
  name: string;
  email: string;
  phone: string;
  accountCreated: string;
  accountDeleted: string;
  web3_address: string;
  discord: IUserTableDiscord;
  identity: IUserTableIdentity;
  uuid: string;
  roles: string;
  mbx_balance?: string;
  accountStatus: AccountStatus;
  bankAccountStatus: BankAccountStatus;
}

export interface IUserTableDiscord {
  connected: (typeof DiscordStatus)[keyof typeof DiscordStatus];
  userName: string;
  id: string;
  verified: string;
  created: string;
  discriminator: string;
}

export interface IUserTableIdentity {
  verified: (typeof IdentityStatus)[keyof typeof IdentityStatus];
  type: (typeof IdentityTypeVerification)[keyof typeof IdentityTypeVerification];
  verifiedDate: string;
  sessions: IUserYotiSessionsDataTable[];
}

export interface IUserForVerificationAge {
  uuid: string;
  email: string;
}

export interface ICloseAccountRequest {
  reason: string;
  user_id: string;
}

export interface ICloseAccountResponse {
  process_id: string;
  timeout: number;
}

export interface IGetPersonIdResponse {
  person_id: string;
}

export interface ICloseAccountStateResponse {
  deletion_status: AccountStatus;
}

export interface Entry {
  entry_id: string;
  entry_type: string;
  direction: string;
  amount: number;
}
export interface IBalanceResponse {
  account_id: string;
  account_status: string;
  account_type: string;
  bank_id: string;
  currency: string;
  encumbrance_amount: number;
  entries: Entry[];
  external_account_id: string;
  pending_amount: number;
  saving_goal_id: string;
  settled_amount: number;
}
