import { CAccountStatus, CBankAccountStatus } from "@pages/scanner/scanner-small-caps/models/constants/accountStatus.constants";

export type AccountStatus= typeof CAccountStatus[keyof typeof CAccountStatus]

export type BankAccountStatus = typeof CBankAccountStatus[keyof typeof CBankAccountStatus]