import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { HttpErrorResponse } from '@angular/common/http';

import { DateTime } from 'luxon';
import { Table } from 'primeng/table';
import { IRateLimit, RecordStatus } from '@modules/discord/rate-limits/models/interface/rate-limit.interface';
import { DurationHour, DurationMinute, IntervalType } from '@modules/discord/rate-limits/models/constants/rate-limit.constants';
import { RateLimitsApi } from '@modules/discord/rate-limits/rate-limits.api';
import { ErrorsManager } from '@core/errors/errors.manager';
import { DateFunctions } from '@shared/utils/date.functions';

@Component({
  selector: 'mdk-rate-limits',
  templateUrl: './rate-limits.page.html',
  styleUrls: ['./rate-limits.page.scss'],
})
export class RateLimitsComponent implements OnInit {

  rateLimitDialog: boolean;
  rateLimits: IRateLimit[] = [];
  selectedRateLimits: IRateLimit[] = [];
  rateLimit: IRateLimit = {
    uuid: "",
    name: "",
    limit_calls: 0,
    inactive: false,
    interval: {
      is_relative: false,
    }
  };
  submitted: boolean;
  absolute: string = IntervalType.ABSOLUTE
  relative: string = IntervalType.RELATIVE
  selectedIntervalType: string = IntervalType.ABSOLUTE
  selectedStatus: string = RecordStatus.ACTIVE
  active:string = RecordStatus.ACTIVE
  inactive:string = RecordStatus.INACTIVE
  startTime: Date;
  endTime: Date;
  relativeTime: Date;
  startTimeEST: string;
  endTimeEST: string;
  @ViewChild('dt') table: Table;

  private readonly messageService:MessageService = inject(MessageService)
  private readonly confirmationService:ConfirmationService = inject(ConfirmationService)
  private readonly rateLimitsApi:RateLimitsApi = inject(RateLimitsApi)
  private readonly errorsManager:ErrorsManager = inject(ErrorsManager)
  private readonly dateFunctions:DateFunctions = inject(DateFunctions)

  ngOnInit(): void {
    this.getItems()
  }

  openNew() {
    const utc = DateTime.utc()
    this.selectedStatus = RecordStatus.ACTIVE
    this.startTime = utc.toJSDate()
    this.endTime = utc.toJSDate()
    this.relativeTime = utc.toJSDate()
    this.selectedIntervalType = IntervalType.ABSOLUTE
    this.submitted = false;
    this.rateLimitDialog = true;
    this.startTimeEST = ""
    this.endTimeEST = ""
    this.rateLimit = {
      name: "",
      uuid: "",
      inactive: false,
      limit_calls: 0,
      interval: {
        is_relative: false,
        absolute : {
          start: utc.toString(),
          end: utc.toString()
        },
        relative: 0
      }
    }
  }

  save() {
    this.submitted = true
    this.rateLimit.status = this.selectedStatus
    this.rateLimit.inactive = this.selectedStatus == RecordStatus.INACTIVE
    if(this.selectedIntervalType === IntervalType.RELATIVE) {
      this.rateLimit.interval.is_relative = true
      const hours = this.relativeTime.getHours()
      const minutes = this.relativeTime.getMinutes()
      this.rateLimit.interval.relative = hours * DurationHour + minutes * DurationMinute
    } else {
      this.rateLimit.interval.is_relative = false
      this.rateLimit.interval.absolute = {}
      const utcStart = this.dateFunctions.toUTCTime(this.startTime)
      const utcEnd = this.dateFunctions.toUTCTime(this.endTime)
      this.rateLimit.interval.absolute.start = utcStart.toString()
      this.rateLimit.interval.absolute.end = utcEnd.toString()
    }

    if (this.rateLimit.name) {
      this.rateLimit.uuid ? this.updateItem() : this.putItem()
      this.rateLimits = [...this.rateLimits];
      this.rateLimitDialog = false;
    }
  }

  putItem() {
    this.saveItemAPI()
    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rate Limit Created', life: 3000});
  }

  updateItem() {
    this.updateItemAPI()
    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rate Limit Updated', life: 3000});
  }

  editItem(rate: IRateLimit) {
    this.setRateTimes(rate)
    this.loadStatus(rate)
    this.selectedStatus = rate.status
    this.rateLimit = {...rate};
    this.rateLimitDialog = true;
  }

  setRateTimes(rate: IRateLimit) {
    if (rate.interval.is_relative) {
      this.setRelativeTime(rate)
    } else {
      this.setAbsoluteTime(rate)
    }
  }

  setRelativeTime(rate: IRateLimit) {
    const now = DateTime.local()    
    const hours = Math.floor(rate.interval.relative / DurationHour)
    const minutes = Math.floor((rate.interval.relative % DurationHour) / DurationMinute)
    const local = DateTime.local(now.year, now.month, now.day, hours, minutes, 0)
    this.relativeTime = local.toJSDate()
    this.selectedIntervalType = IntervalType.RELATIVE
  }

  setAbsoluteTime(rate: IRateLimit) {
    const now = DateTime.local()
    const start = DateTime.fromISO(rate.interval.absolute.start).toUTC()
    const end = DateTime.fromISO(rate.interval.absolute.end).toUTC()

    const startLocal = this.dateFunctions.toLocalDateTime(now, start)
    const endLocal = this.dateFunctions.toLocalDateTime(now, end)

    const startUtc = this.dateFunctions.toUTCDateTime(now, start)
    const endUtc = this.dateFunctions.toUTCDateTime(now, end)

    const startESTTime = this.dateFunctions.toESTTime(startUtc)
    const endESTTime = this.dateFunctions.toESTTime(endUtc)

    this.startTime = startLocal.toJSDate()
    this.endTime = endLocal.toJSDate()

    this.startTimeEST = this.dateFunctions.getTimeStr(startESTTime)
    this.endTimeEST = this.dateFunctions.getTimeStr(endESTTime)

    this.selectedIntervalType = IntervalType.ABSOLUTE


  }

  deleteItem(rate: IRateLimit) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + rate.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteItemAPI(rate)
            this.rateLimits = this.rateLimits.filter(val => val.uuid !== rate.uuid);
            this.rateLimit = {
              uuid: "",
              name: "",
              limit_calls: 0,
              inactive: false,
              interval: {
                is_relative: false,
              }
            };
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Rate Limit Deleted', life: 3000});
        }
    });
  }

  hideDialog() {
    this.rateLimitDialog = false;
    this.submitted = false;
  }

  updateStartTime(){
    this.startTimeEST = this.dateFunctions.getTimeStr(this.dateFunctions.toESTTime(this.dateFunctions.toUTCTime(this.startTime)))
  }

  updateEndTime(){
    this.endTimeEST = this.dateFunctions.getTimeStr(this.dateFunctions.toESTTime(this.dateFunctions.toUTCTime(this.endTime)))
  }


  loadItems(items: IRateLimit[]):void {
    this.rateLimits = items;
    this.rateLimits.forEach(item => this.loadStatus(item))
  }

  loadStatus(rate: IRateLimit):void {
    rate.status = rate.inactive ? RecordStatus.INACTIVE : RecordStatus.ACTIVE
  }

  getItems():void {
    this.rateLimitsApi.getRateLimits().subscribe({
      next: result => {
        this.loadItems(result)
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
      }
    })
  }

  saveItemAPI():void {
    this.rateLimitsApi.createRateLimit(this.rateLimit).subscribe({
      next: result => {
        this.setItem(result)
        this.rateLimits.push(this.rateLimit);
        this.rateLimit = this.initObject()
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
      }
    })
  }

  updateItemAPI():void {
    this.rateLimitsApi.updateRateLimit(this.rateLimit).subscribe({
      next: result => {
        this.setItem(result)
        const index = this.rateLimits.findIndex(element => element.uuid === this.rateLimit.uuid)
        this.rateLimits[index] = this.rateLimit;
        this.rateLimit = this.initObject()
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
      }
    })
  }

  deleteItemAPI(rate: IRateLimit):void {
    this.rateLimitsApi.deleteRateLimit(rate.uuid).subscribe({
      next: () => {
        this.rateLimit = this.initObject()
      },
      error: (error: HttpErrorResponse) => {
        this.errorsManager.manageErrors(error)
      }
    })
  }

  setItem(rate: IRateLimit):void {
    this.rateLimit.uuid = rate.uuid
    this.rateLimit.created = rate.created
    this.rateLimit.updated = rate.updated
  }

  initObject():IRateLimit{
    return {
      uuid: "",
      name: "",
      limit_calls: 0,
      inactive: false,
      interval: {
        is_relative: false,
      }
    };
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains')
  }

}
