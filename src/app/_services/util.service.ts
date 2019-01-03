import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getThisMonthEnd = function (aDay) {
    let year = aDay.slice(0, 4);
    let month = aDay.slice(5, 7);
    let endDay;
    if (month == '02') {
      endDay = parseInt(year) % 4 == 0 ? '29' : '28';
    } else if (month == '04' || month == '06' || month == '09' || month == '11') {
      endDay = '30';
    } else {
      endDay = '31';
    }
    return (year + '-' + month + '-' + endDay);
  }

  getMonthEnd = function (aDay) {
    let year = aDay.slice(0, 4);
    let month = aDay.slice(5, 7);
    let day = aDay.slice(8, 10);
    let endYear;
    let endMonth;
    let endDay;
    if (parseInt(day) < 16) {
      endYear = year;
      endMonth = month;
      if (endMonth == '02') {
        endDay = parseInt(endYear) % 4 == 0 ? '29' : '28';
      } else if (endMonth == '04' || endMonth == '06' || endMonth == '09' || endMonth == '11') {
        endDay = '30';
      } else {
        endDay = '31';
      }
    } else {
      if (month == '12') {
        endYear = (parseInt(year) + 1).toString();
        endMonth = '01';
        endDay = '31';
      } else {
        endYear = year;
        endMonth = parseInt(month) >= 9 ? (parseInt(month) + 1).toString() : '0'.concat((parseInt(month) + 1).toString());
        if (endMonth == '02') {
          endDay = parseInt(endYear) % 4 == 0 ? '29' : '28';
        } else if (endMonth == '04' || endMonth == '06' || endMonth == '09' || endMonth == '11') {
          endDay = '30';
        } else {
          endDay = '31';
        }
      }
    }
    return (endYear + '-' + endMonth + '-' + endDay);
  }

  //end date is end of month
  getPortion = function (start, end) {
    if (new Date(start) > new Date(end)) return null;
    let startYear = start.slice(0, 4);
    let startMonth = start.slice(5, 7);
    let startDay = start.slice(8, 10);
    let endYear = end.slice(0, 4);
    let endMonth = end.slice(5, 7);
    let endDay = end.slice(8, 10);
    let startDays, endDays, startPortion, endPortion;
    if (startMonth == "02") {
        startDays = parseInt(startYear) % 4 == 0 ? 29 : 28;
    } else if (startMonth == "04" || startMonth == '06' || startMonth == '09' || startMonth == '11') {
        startDays = 30;
    } else {
        startDays = 31;
    }
    if (startDay > startDays) {
        return null;
    } else {
        startPortion = (parseInt(startDay) - 1) / startDays;
    }

    if (endMonth == "02") {
        endDays = parseInt(endYear) % 4 == 0 ? 29 : 28;
    } else if (endMonth == "04" || endMonth == '06' || endMonth == '09' || endMonth == '11') {
        endDays = 30;
    } else {
        endDays = 31;
    }
    if (endDay > endDays) {
        return null;
    } else {
        endPortion = parseInt(endDay) / endDays;
    }
    
    return (parseInt(endYear) - parseInt(startYear)) * 12 + parseInt(endMonth) - parseInt(startMonth) + endPortion - startPortion;
  }

  dateToString = function (date) {
    let s = date.toString();
    console.log(s);
    return s;
  }

}
