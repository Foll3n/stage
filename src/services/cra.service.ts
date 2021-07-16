import {Injectable} from '@angular/core';
import {Cra} from '../app/models/Cra';
import {Subject} from 'rxjs';
import {CR} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {CompteRendu} from '../app/models/CompteRendu';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {element} from 'protractor';
import {formatDate, getLocaleFirstDayOfWeek} from '@angular/common';
import {environment} from '../environments/environment';
import {Utilisateur} from '../app/models/utilisateur';
import {Reponse} from '../app/utilisateurs/utilisateurs.component';

@Injectable()
export class CraService{

  httpOptions = {
    headers: new HttpHeaders()
  };
  // date_day = new Date('2021-01-01');

  // date_first = getLocaleFirstDayOfWeek('fr');
  // date_last = this.date_first + 6;
  dayDate = new Date();
  firstDateWeek = new Date(this.dayDate.setDate(this.dayDate.getDate() - this.dayDate.getDay() + 1));
  firstDateWeekFormat = formatDate(this.firstDateWeek, 'yyyy-MM-dd', 'fr');
  lastDateWeek = new Date(this.dayDate.setDate(this.dayDate.getDate() - this.dayDate.getDay() + 7));
  lastDateWeekFormat = formatDate(this.lastDateWeek, 'yyyy-MM-dd', 'fr');


    listeCr: CompteRendu[] = [
      new CompteRendu(1, 'commande1', 0.1, 'red'),
      new CompteRendu(1, 'commande2', 0.4, 'green')];
  listeCr1: CompteRendu[] = [
    new CompteRendu(2, 'commande1', 0.0, 'red'),
    new CompteRendu(2, 'commande2', 0.5, 'green')];
  listeCr2: CompteRendu[] = [
    new CompteRendu(3, 'commande1', 0.6, 'red'),
    new CompteRendu(3, 'commande2', 0.7, 'green')];
  listeCr3: CompteRendu[] = [
    new CompteRendu(4, 'commande1', 0.8, 'red'),
    new CompteRendu(4, 'commande2', 0.6, 'green')];
  listeCr4: CompteRendu[] = [
    new CompteRendu(5, 'commande1', 0.1, 'red'),
    new CompteRendu(5, 'commande2', 0.9, 'green')];

    private listeCra = [
        new Cra(1, 1, new Date('2021-01-01'), 0.0, 0, this.listeCr),
        new Cra(2, 1, new Date('2021-01-02'), 0.0, 0, this.listeCr1),
        new Cra(3, 1, new Date('2021-01-03'), 0.0, 0, this.listeCr2),
      new Cra(4, 1, new Date('2021-01-04'), 0.0, 0, this.listeCr3),
      new Cra(5, 1, new Date('2021-01-05'), 0.0, 0, this.listeCr4),
    ];


  craSubject = new Subject<Cra[]>();

  constructor(private httpClient: HttpClient){
    console.log('>>>>>>>>>>>>>>>>>>' + this.firstDateWeek + ' --- ' + this.lastDateWeek);
    this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))});
  }


  emitCraSubject(){
    this.craSubject.next(this.listeCra.slice());
  }
addCr(cr: CompteRendu){
    for (const cra of this.listeCra){
      cra.listeSousProjet.push(new CompteRendu(cra.idCra, cr.numCommande, cr.duree, cr.color));
    }
    this.emitCraSubject();

}

  addCra(cra: Cra){
    this.listeCra.push(cra);
    this.emitCraSubject();
  }
  getCraById(id: number){
    const cra = this.listeCra.find(
      (craObject) => {
        return craObject.idCra === id;
      }
    );
    return cra;
  }

  validUser(){
    for (const cra of this.listeCra) {
      cra.status = 1;
    }
    this.emitCraSubject();
  }
affichercra(){
    console.log(this.listeCra);
}
  findIndexToUpdate(cra: Cra) {
    // @ts-ignore
    return cra.idCra === this;
  }
  editCra(cra: Cra){
    const updateItem = this.listeCra.find(this.findIndexToUpdate, cra.idCra);
    let index = 0;
    if (updateItem instanceof Cra) {
      index = this.listeCra.indexOf(updateItem);
    }
    this.listeCra[index] = cra;
    this.emitCraSubject();

  }
  editCraDuree(idCra: number, duree: number, indexCr: number){

    console.log('coucou---' + duree + ' indexxx :' + '' + ' -------->' + idCra);
    const updateItem = this.listeCra.find(x => x.idCra === idCra);
    // @ts-ignore

    if (updateItem instanceof Cra) {
      const index = this.listeCra.indexOf(updateItem);
      this.listeCra[index].listeSousProjet[indexCr].duree = duree;
      this.emitCraSubject();
    }

  }
  getCraToServer() {
    this.httpClient.get(environment.urlCra + '?date_start=' + this.firstDateWeekFormat + '&date_end=' +  this.lastDateWeekFormat + '&id_usr=' + '1', this.httpOptions).subscribe(
      reponse => {
            console.log(reponse);
      },
      error => {
        console.log(error + 'le serveur ne répond pas !');
      }
    );
  }

  addCraServer(){
    console.log('je rentre bien ici !! ');
    var listeCraWeek : Cra[] = [];
    for (let i = 0; i < 5; i++){
      const cra = new Cra(0, 1, new Date(this.firstDateWeek.getDate() + i), 0, 0, []);
      listeCraWeek.push(cra);
    }
    const json =  JSON.stringify(listeCraWeek) ;

    this.httpClient.post(environment.urlCra, json, this.httpOptions).subscribe(
      reponse => {
      console.log(reponse);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  getListeCraFromServer() {
    this.httpClient
      .get<any[]>('https://httpclient-demo.firebaseio.com/cra.json')
      .subscribe(
        (response) => {
          this.listeCra = response;
          this.emitCraSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

}
