import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { DateTime } from "luxon";
import { IProofItem } from "./interfaces/proofs.interfaces";
import {
  IAchievementParticipantActionData,
  IGetAchievementParticipationsResponse,
  IGetAchievementParticipationsResponseData,
  IGetAchievementResponse,
} from "./interfaces/api.interfaces";
import { CProofStatus } from "./constants/proofs.constants";
import { AchievementsApi } from "@modules/mobile/achievements/achievements.api";
import { IAchievementsItem } from "@modules/mobile/achievements/models/interfaces/achievements.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProofsApi {

  private MONOLITH_URL: string = environment.APIS.MONOLITH_URL;

  private readonly http:HttpClient = inject(HttpClient)
  private readonly achievementApi:AchievementsApi = inject(AchievementsApi)

  getParticipants(achievement: IAchievementsItem): Observable<IProofItem[]> {
    return this.http
      .get<IGetAchievementParticipationsResponse>(
        `${this.MONOLITH_URL}/backoffice/achievements/${achievement.id}/participations`
      )
      .pipe(
        map((response) => {
          const relationships =
            response.data?.relationships?.participation?.data;
          if (relationships) {
            return relationships.map((participant) => {
              return this.transformParticipantAttributes(
                participant,
                achievement
              );
            });
          }

          return null;
        })
      );
  }

  getAchievement(id: string): Observable<IAchievementsItem> {
    return this.http
      .get<IGetAchievementResponse>(
        `${this.MONOLITH_URL}/backoffice/achievements/${id}`
      )
      .pipe(
        map((response) => {
          return this.achievementApi.transformAchievementsAttributes(
            response.data
          );
        })
      );
  }

  dismissProof(
    achievement_id: string,
    participation_id: string
  ): Observable<void> {
    return this.http.post<void>(
      encodeURI(
        `${this.MONOLITH_URL}/backoffice/achievements/${achievement_id}/${participation_id}/dismiss`
      ),
      null
    );
  }

  approveProof(
    achievement_id: string,
    participation_id: string
  ): Observable<void> {
    return this.http.post<void>(
      encodeURI(
        `${this.MONOLITH_URL}/backoffice/achievements/${achievement_id}/${participation_id}/approve`
      ),
      null
    );
  }

  burnProof(
    achievement_id: string,
    participation_id: string
  ): Observable<void> {
    const postData = this.getPostData(achievement_id, participation_id);
    return this.http.post<void>(
      `${this.MONOLITH_URL}/backoffice/achievements/burn`,
      postData
    );
  }

  private transformParticipantAttributes(
    proof: IGetAchievementParticipationsResponseData,
    achievement: IAchievementsItem
  ): IProofItem {
    return {
      id: proof.id,
      definition_id: achievement.id,
      user_email: proof.attributes.email,
      mbxReward: achievement.MBXRewards,
      submittedDate:
        DateTime.fromISO(proof.attributes.created_at).toUTC().toJSDate() ||
        null,
      image: proof.attributes.proof.url,
      text: proof.attributes.proof.description,
      status: CProofStatus[proof.attributes.state],
    };
  }

  private getPostData(
    achievement_id: string,
    participation_id: string
  ): IAchievementParticipantActionData {
    return {
      definition_id: achievement_id,
      participation_id: participation_id,
    };
  }
}
