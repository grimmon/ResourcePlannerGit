import { Injectable } from '@angular/core';
import { TimeAggregation } from '../models';

@Injectable()
export class DateService {

    format(date: Date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString(10).padStart(2, '0') + '-' + date.getDate().toString(10).padStart(2, '0');
    }

    update(currentDate: Date, currentAggregation: TimeAggregation, pageSize: number, periodOffset: number) {
        return this.moveDate(currentDate, currentAggregation, periodOffset * pageSize);
    }

    getStart(currentDate: Date, currentAggregation: TimeAggregation, pageSize: number) {
        return this.moveDate(currentDate, currentAggregation, -1); //we want to start with the previous period.
    }

    getEnd(currentDate: Date, currentAggregation: TimeAggregation, pageSize: number) {
        return this.moveDate(currentDate, currentAggregation, pageSize - 2); //The number of periods into the future we want.
    }

    constructor() {
    }

    private getDay(date: Date, periodOffset: number) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + periodOffset, 0, 0, 0, 0);
    }

    private getWeek(date: Date, periodOffset: number) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + -1 * date.getDay() + periodOffset * 7, 0, 0, 0, 0);
    }

    private getMonth(date: Date, periodOffset: number) {
        return new Date(date.getFullYear(), date.getMonth() + periodOffset, 1, 0, 0, 0, 0);
    }

    private getQuarter(date: Date, periodOffset: number) {
        return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3 + periodOffset * 3, 1, 0, 0, 0, 0);
    }

    private moveDate(currentDate: Date, currentAggregation: TimeAggregation, periodOffset: number): Date {
        switch (currentAggregation) {
            case TimeAggregation.Daily:
                return this.getDay(currentDate, periodOffset);
            case TimeAggregation.Weekly:
                return this.getWeek(currentDate, periodOffset);
            case TimeAggregation.Monthly:
                return this.getMonth(currentDate, periodOffset);
            case TimeAggregation.Quarterly:
                return this.getQuarter(currentDate, periodOffset);
            default:
                return currentDate;
        }
    }
}