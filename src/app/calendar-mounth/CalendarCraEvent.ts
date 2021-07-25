import {CalendarEvent} from "angular-calendar";

export class CalendarCraEvent implements CalendarEvent{
  constructor(
    private start: Date,
    private title: string,
    private duree : number
  ) {
  }




}
