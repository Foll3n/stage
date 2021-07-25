import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarView
} from 'angular-calendar';
import {Cra} from '../models/Cra';
import {CompteRenduInsert} from '../models/CompteRenduInsert';
import {CraService} from '../../services/cra.service';


const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#FAE3E3'
  },
  red: {
    primary: '#ad2121',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};




@Component({
  selector: 'app-calendar-mounth',
  templateUrl: './calendar-mounth.component.html',
  styleUrls: ['./calendar-mounth.component.scss'],
  styles: [
    `
      .cal-month-view .bg-pink,
      .cal-week-view .cal-day-columns .bg-pink,
      .cal-day-view .bg-pink
      .cal-month-view .cal-cell.cal-event-highlight{
        background-color: hotpink !important;
      }
    `,
  ],
})
export class CalendarMounthComponent implements OnInit {

  constructor(private modal: NgbModal, private craService: CraService) {}

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;


  view: CalendarView = CalendarView.Month;
  listeCra: Cra[] = [];
  CalendarView = CalendarView;

  events: CustomEvent[] = [];
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();


  activeDayIsOpen: boolean = true;

  ngOnInit(
  ) {
    // @ts-ignore
   this.initialisation();
  }

  initialisation(){
    // @ts-ignore
    let listeCraWeek = this.craService.listeCraWeek;
    console.log('ok' + this.listeCra);
    for (const week of listeCraWeek){
      console.log("ici1");
    for (const cra of week.listeCra) {
      this.listeCra.push(cra);
      for (const sp of cra.listeCr){
        console.log("iciii");
        this.addEvent('Commande :' + sp.numCommande, cra.date, sp.color, cra.duree_totale);
      }}
  }}

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    console.log('ok');
    renderEvent.body.forEach((day) => {

      const dayOfMonth = day.date.getDate();

      for (const c of this.listeCra){

        if (c.date.getDate() == dayOfMonth && isSameMonth(c.date, this.viewDate)){
          if (c.duree_totale == 1.0){
            day.backgroundColor = "#90EE90";}
          else if (c.duree_totale<1){
            day.backgroundColor = "#E0ECF8"; //bleu clair
          }
          else{

            day.backgroundColor = "#F6CECE";
          }
        }
      }




    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("test clic jour");
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(titre:string, start: Date , color: any, duree: number): void {
    console.log('event');
    this.events = [
      ...this.events,
      {
        title: titre,
        start: start,
        end: start,
        color: color,
        duree : duree
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}

interface CustomEvent extends CalendarEvent {
  duree: number;
}
