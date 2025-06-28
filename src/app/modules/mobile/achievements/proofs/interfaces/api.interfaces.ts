
import { IGetAchievementsResponseData } from "@modules/mobile/achievements/models/interfaces/api.interfaces";
import { CProofStatusApi } from "../constants/proofs.constants";

export interface IGetAchievementResponse {
  data: IGetAchievementsResponseData;
}

export interface IGetAchievementParticipationsResponse {
  data: IGetAchievementsResponseData;
}

export interface IGetAchievementParticipationsResponseData {
  data: IGetAchievementsResponseData;
}

export interface IGetAchievementParticipationsResponseRelationships {
  participation?: IGetAchievementParticipationsResponseRelationshipsParticipation;
}

export interface IGetAchievementParticipationsResponseRelationshipsParticipation {
  data?: IGetAchievementParticipationsResponseData[];
}

export interface IGetAchievementParticipationsResponseData {
  type: string;
  id: string;
  attributes: IGetAchievementParticipationsResponseDataAttributes;
}

export interface IGetAchievementParticipationsResponseDataAttributes {
  email: string;
  definition_id: string;
  auto_approved: boolean;
  created_at: string;
  updated_at: string;
  state: (typeof CProofStatusApi)[keyof typeof CProofStatusApi];
  proof: IGetAchievementParticipationsResponseProof;
}

export interface IGetAchievementParticipationsResponseProof {
  type: string;
  url: string;
  name: string;
  description: string;
}

export interface IAchievementParticipantActionData {
  definition_id: string;
  participation_id: string;
}
