import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  IGetAchievementsResponse,
  IGetAchievementsResponseAttributes,
  ICreateAchievementsResponse,
  IGetAchievementsResponseData,
  IAchievementComplete,
} from "./models/interfaces/api.interfaces";
import { IAchievementsItem } from "./models/interfaces/achievements.interfaces";
import { environment } from "src/environments/environment";
import { DateTime } from "luxon";
import { DateFunctions } from "@shared/utils/date.functions";


@Injectable({
  providedIn: "root",
})
export class AchievementsApi {

  private MONOLITH_URL: string = environment.APIS.MONOLITH_URL;

  private readonly http:HttpClient = inject(HttpClient)
  private readonly dateFunctions:DateFunctions = inject(DateFunctions)


  transformAchievementsAttributes(
    achievement: IGetAchievementsResponseData
  ): IAchievementsItem {
    return {
      id: achievement.id,
      name: achievement.attributes.name || "",
      link: achievement.attributes.link || "",
      miniDescription: achievement.attributes.summary || "",
      bigDescription: achievement.attributes.description || "",
      icon: achievement.attributes.icon || "",
      visibility: achievement.attributes.visibility || false,
      contributes: achievement.attributes.streak || false,
      MBXRewards:
        achievement.attributes.reward_mbx !== 0
          ? achievement.attributes.reward_mbx
          : null,
      pointsRewards:
        achievement.attributes.reward_points !== 0
          ? achievement.attributes.reward_points
          : null,
      startDate: achievement.attributes.started_at
        ? DateTime.fromISO(achievement.attributes.started_at).toUTC().toJSDate()
        : null,
      endDate: achievement.attributes.ended_at
        ? DateTime.fromISO(achievement.attributes.ended_at).toUTC().toJSDate()
        : null,
      conditions: achievement.attributes.conditions || "",
      proof: achievement.attributes.proof || null,
      automaticPayment: achievement.attributes.auto_approve || false,
      annoucementNotificationTitle:
        achievement.attributes.notification_announcement.title || "",
      annoucementNotificationDescription:
        achievement.attributes.notification_announcement.body || "",
      finishedNotificationTitle:
        achievement.attributes.notification_finished.title || "",
      finishedNotificationDescription:
        achievement.attributes.notification_finished.body || "",
    };
  }

  getItems(): Observable<IAchievementsItem[]> {
    return this.http
      .get<IGetAchievementsResponse>(`${this.MONOLITH_URL}/backoffice/achievements`)
      .pipe(
        map((response) => {
          return response.data.map((achievement) =>
            this.transformAchievementsAttributes(achievement)
          );
        })
      );
  }

  createItem(
    item: IGetAchievementsResponseAttributes
  ): Observable<ICreateAchievementsResponse> {
    this.castDates(item);
    return this.http.post<ICreateAchievementsResponse>(
      `${this.MONOLITH_URL}/backoffice/achievements`,
      item
    );
  }

  updateItem(
    item: IGetAchievementsResponseAttributes,
    id: string
  ): Observable<IAchievementsItem> {
    this.castDates(item);
    return this.http
      .put<ICreateAchievementsResponse>(
        `${this.MONOLITH_URL}/backoffice/achievements/${id}`,
        item
      )
      .pipe(
        map((response) => this.transformAchievementsAttributes(response.data))
      );
  }

  updateVisibility(id: string, isCompleted: boolean): Observable<void> {
    const itemComplete: IAchievementComplete = {
      complete: isCompleted,
    };
    return this.http.put<void>(
      `${this.MONOLITH_URL}/backoffice/achievements/${id}/complete`,
      itemComplete
    );
  }

  private castDates(item: IGetAchievementsResponseAttributes): void {
    item.started_at = this.dateFunctions.toISO8601(item.started_at);
    item.ended_at = this.dateFunctions.toISO8601(item.ended_at);
  }
}
