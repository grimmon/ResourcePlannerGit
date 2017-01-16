import { Injectable } from '@angular/core';
import { TimeAggregation } from '../models';

@Injectable()
export class DateService {


    getDate(date: string): Date {//YYYY-MM-DD
        return new Date(
            parseInt(date.substr(0, 4), 10),
            parseInt(date.substr(5, 2), 10) - 1, // Month (0-11)
            parseInt(date.substr(8, 2), 10));
    }

    getDuration(start: string, end: string): number {//YYYY-MM-DD return in weeks
        var s = this.getDate(start).getTime(),
            e = this.getDate(end).getTime(),
            d = e - s;
            
        return Math.round(d / (1000 * 3600 * 24 * 7));
    }

    format(date: Date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString(10).padStart(2, '0') + '-' + date.getDate().toString(10).padStart(2, '0');
    }

    formatString(date: string) {
        return this.format(this.getDate(date));
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

    min(startDate: string, endDate: string): string {
        return startDate > endDate ? endDate : startDate;
    }

    max(startDate: string, endDate: string): string {
        return !endDate || endDate < startDate ? startDate : endDate;
    }

    moveDate(currentDate: Date, currentAggregation: TimeAggregation, periodOffset: number): Date {
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
}