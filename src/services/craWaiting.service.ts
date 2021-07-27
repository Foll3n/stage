import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../app/configuration/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../app/Cra/models/realisation/Realisation';
import {CraWeekInsert} from '../app/Cra/models/logCra/craWeekInsert';
import {CraHttpDatabase} from '../app/configuration/CraHttpDatabase';
import {LogCraHttpDatabase} from '../app/configuration/LogCraHttpDatabase';
import {Log} from '../app/Cra/models/logCra/Log';


@Injectable()
export class CraWaitingService {
  userId = '10';
  waitingSubject = new Subject<CraWeekInsert[]>();
  validateSubject = new Subject<CraWeekInsert[]>();
  public listeCraWaiting: CraWeekInsert[] = [];
  public listeCraValidate: CraWeekInsert[] = [];
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.fillListeCraWaiting('1');
    this.fillListeCraWaiting('2');


  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  emitCraWaintingSubject(): void {
    this.waitingSubject.next(this.listeCraWaiting.slice());
    this.validateSubject.next(this.listeCraValidate.slice());
  }

  fillListeCraWaiting(index:string){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekWaiting(index);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(" --------" ,reponse);
        // this.listeCraWaiting = this.sortList(reponse.listeCraWeek);
        if (index == '1' && reponse.listeCraWeek){
          this.listeCraWaiting = reponse.listeCraWeek;
        }
        else if(index == '2' && reponse.listeCraWeek){
          this.listeCraValidate = reponse.listeCraWeek;
        }
        if(reponse.listeCraWeek != null)
          this.emitCraWaintingSubject();

      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }
  validerCra(cra: CraWeekInsert, commentaire:string){
    cra.status = '2';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.deleteCraWait(cra);
        this.listeCraValidate.push(cra);
        this.emitCraWaintingSubject();
        // met à jour automatiquement
        this.makeLog(cra,commentaire);
      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }
  deleteCraWait(cra: CraWeekInsert){
    const c = this.getCraWeek(cra);
    if (c){
      const index = this.listeCraWaiting.indexOf(c, 0);
      this.listeCraWaiting.splice(index, 1);
    }

  }
  public getCraWeek(cra: CraWeekInsert): CraWeekInsert | null {
    if (cra.idCra){
      const res = this.listeCraWaiting.find(
        (c) => c.idCra === cra.idCra);
      return res as CraWeekInsert;
    }
    return null;
  }
  refuserCra(cra: CraWeekInsert, commentaire: string){
    cra.status = '0';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      this.deleteCraWait(cra);
      this.emitCraWaintingSubject();
      this.makeLog(cra,commentaire);
    });



  }
  makeLog(cra:CraWeekInsert, commentaire:string){
    if (!commentaire){
      commentaire = 'KO';
    }
    commentaire.substr(0,254);
    let log = new Log('','10','10',cra.status,commentaire,cra.idCra!.toString());
    const logHttp = new LogCraHttpDatabase(this.httpClient);
    const res = logHttp.addLog(log);
    res.subscribe(reponse => {
      console.log(reponse);
    });
  }
}
