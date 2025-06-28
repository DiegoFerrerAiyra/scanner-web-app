import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DateFunctions {

  constructor() { }

  toESTTime(time: DateTime): DateTime {
    return time.setZone("America/New_York")
  }

  toLocalTime(date: Date): DateTime {
    return DateTime.local(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes())
  }

  toUTCTime(date: Date): DateTime {
    return DateTime.utc(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes())
  }

  toUTCDateTime(date: DateTime, time:DateTime): DateTime {
    return DateTime.utc(date.year, date.month, date.day, time.hour, time.minute)
  }

  toLocalDateTime(date: DateTime, time:DateTime): DateTime {
    return DateTime.local(date.year, date.month, date.day, time.hour, time.minute)
  }

  getTimeStr(time:DateTime):string {
    return `${this.pad2(time.hour)}:${this.pad2(time.minute)}`
  }

  pad2(number: number):string {
    return (number < 10 ? '0' : '') + number
  }

  toISO8601(dateStr: string):string {
    const date = new Date(dateStr)
    return date.toISOString()
  }
}