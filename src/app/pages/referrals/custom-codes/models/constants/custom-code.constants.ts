import { ICustomCodeReward } from "@pages/referrals/custom-codes/models/interfaces/custom-codes.interfaces";

export const CReferralCustomCodeRewards: ReadonlyArray<ICustomCodeReward> = [
    { value: "REWARD_0", amount: 0 },
    { value: "REWARD_5", amount: 5 },
    { value: "REWARD_10", amount: 10 },
] as const;