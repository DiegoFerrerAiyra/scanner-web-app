import { IGetAchievementParticipationsResponseRelationships } from "@modules/mobile/achievements/proofs/interfaces/api.interfaces";
import { CAchievementsProof } from "../constants/achievements.constants";


export interface IGetAchievementsResponse {
  data: IGetAchievementsResponseData[];
}

export interface ICreateAchievementsResponse {
  data: IGetAchievementsResponseData;
}

export interface IGetAchievementsResponseData {
  type: string;
  id: string;
  attributes: IGetAchievementsResponseAttributes;
  relationships?: IGetAchievementParticipationsResponseRelationships;
}

export interface IGetAchievementsResponseAttributes {
  name: string;
  summary: string;
  icon: string;
  visibility: boolean;
  streak: boolean;
  reward_mbx: number;
  reward_points: number;
  description: string;
  conditions: string;
  link: string;
  proof: IAchievementProof;
  auto_approve: boolean;
  started_at: string;
  ended_at: string;
  notification_announcement: INotificationAnnouncement;
  notification_finished: INotificationFinished;
}

export interface IAchievementProof {
  type: (typeof CAchievementsProof)[keyof typeof CAchievementsProof];
  url: string;
  name: string;
  description: string;
}

interface INotificationAnnouncement {
  title: string;
  body: string;
}

interface INotificationFinished {
  title: string;
  body: string;
}

export interface IAchievementComplete {
  complete: boolean;
}
