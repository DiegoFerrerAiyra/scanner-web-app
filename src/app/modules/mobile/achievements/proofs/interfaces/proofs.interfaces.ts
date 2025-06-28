import { CProofStatus } from "../constants/proofs.constants";

export interface IProofItem {
    id:string,
    user_email:string,
    definition_id:string,
    text:string,
    image:string,
    submittedDate:Date,
    status:typeof CProofStatus[keyof typeof CProofStatus],
    mbxReward:number,
}