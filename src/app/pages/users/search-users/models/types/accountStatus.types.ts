import { CAccountStatus, CBankAccountStatus } from "@pages/users/search-users/models/constants/accountStatus.constants";

export type AccountStatus= typeof CAccountStatus[keyof typeof CAccountStatus]

export type BankAccountStatus = typeof CBankAccountStatus[keyof typeof CBankAccountStatus]