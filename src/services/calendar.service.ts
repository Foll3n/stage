import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../app/configuration/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../app/models/Realisation';
import {Projet} from '../app/models/Projet';
import {ProjetHttpDatabase} from '../app/configuration/ProjetHttpDatabase';
import {InsertCra} from '../app/models/InsertCra';
import {CraHttpDatabase} from '../app/configuration/CraHttpDatabase';
import {Router} from '@angular/router';


@Injectable()
export class CalendarService {
  userId = '10';
  listeCra!: InsertCra[];
  calendarSubject = new Subject<InsertCra[]>();

  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.chargerCalendar();
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitCalendarSubject(): void {
    this.calendarSubject.next(this.listeCra.slice());
  }


  chargerCalendar(){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getAllCra('10');
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeCra = reponse.liste_cra;
        this.emitCalendarSubject();
      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }
}
