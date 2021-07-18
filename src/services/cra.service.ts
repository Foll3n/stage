import {Injectable} from '@angular/core';
import {Cra} from '../app/models/Cra';
import {Subject} from 'rxjs';
import {CompteRendu} from '../app/models/CompteRendu';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {environment} from '../environments/environment';
import {InsertCra} from '../app/models/InsertCra';
import {CraHttpDatabase} from '../app/configuration/CraHttpDatabase';

@Injectable()
export class CraService {
  httpOptions = {
    headers: new HttpHeaders()
  };
  public dayDate = new Date();
  firstDateWeek = new Date(this.dayDate.setDate(this.dayDate.getDate() - this.dayDate.getDay() + 1));
  public firstDateWeekFormat = formatDate(this.firstDateWeek, 'yyyy-MM-dd', 'fr');
  lastDateWeek = new Date(this.dayDate.setDate(this.dayDate.getDate() - this.dayDate.getDay() + 7));
  public lastDateWeekFormat = formatDate(this.lastDateWeek, 'yyyy-MM-dd', 'fr');

  public dateToday = formatDate(this.dayDate, 'dd MMMM yyyy', 'fr');
  public lastDate = formatDate(this.lastDateWeek, 'dd MMMM ', 'fr');
  public firstDate = formatDate(this.firstDateWeek, 'dd MMMM ', 'fr');
  public listeCr: CompteRendu[] = [];
  craSubject = new Subject<Cra[]>();
  crSubject = new Subject<CompteRendu[]>();
  private listeCra: Cra[] = [];

  constructor(private httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.remplirTest();
  }

  emitCraSubject(): void {
    this.craSubject.next(this.listeCra.slice());
    this.crSubject.next(this.listeCr.slice());
  }

  addCr(cr: CompteRendu): void {
    for (const cra of this.listeCra) {
      cra.listeCr.push(new CompteRendu(cra.id_cra, cr.numCommande, cr.duree, cr.color));
    }
    this.listeCr.push(cr);
    this.emitCraSubject();
  }

  addCra(cra: Cra): void {
    this.listeCra.push(cra);
    this.emitCraSubject();
  }

  public getCraById(id: number): Cra {
    const cra = this.listeCra.find(
      (craObject) => craObject.id_cra === id);
    return cra as Cra;
  }

  validUser(): void {
    for (const cra of this.listeCra) {
      cra.status = 1;
    }
    this.emitCraSubject();
  }

  getDureeTotaleCra(idCra: number): number {
    return this.getCraById(idCra).duree_totale;
  }

  affichercra(): void {
    console.log(this.listeCra);
  }

  findIndexToUpdate(cra: Cra): void {
    // @ts-ignore
    return cra.id_cra === this;
  }

  editCra(cra: Cra): void {
    const updateItem = this.listeCra.find(this.findIndexToUpdate, cra.id_cra);
    let index = 0;
    if (updateItem instanceof Cra) {
      index = this.listeCra.indexOf(updateItem);
    }
    this.listeCra[index] = cra;
    this.emitCraSubject();

  }

  editCraDuree(idCra: number, duree: number, indexCr: number): void {
    const updateItem = this.listeCra.find(x => x.id_cra === idCra);
    // @ts-ignore
    if (updateItem instanceof Cra) {
      const index = this.listeCra.indexOf(updateItem);
      const save = this.listeCra[index].listeCr[indexCr].duree;
      this.listeCra[index].listeCr[indexCr].duree = duree;
      this.listeCra[index].duree_totale = +(this.listeCra[index].duree_totale - save + duree).toPrecision(2);
      this.emitCraSubject();
    }

  }

  // tslint:disable-next-line:variable-name
  public transform(liste_cra: InsertCra[]): void {
    this.listeCra = [];
    for (const cra of liste_cra) {
      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.status;
      this.listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, cra.listeCr));
    }
  }

  // tslint:disable-next-line:variable-name
  public transformToInsertCra(liste_cra: Cra[]): InsertCra[] {
    const res = [];
    for (const cra of liste_cra) {
      const id = cra.id_cra.toString();
      const idUsr = cra.id_usr.toString();
      const duree = cra.duree_totale.toString();
      const status = cra.status.toString();
      res.push(new InsertCra(id, idUsr, formatDate(cra.date, 'yyyy-MM-dd', 'fr'), duree, status, cra.listeCr));
    }
    return res;
  }

  supprimer(): void {
    const json = JSON.stringify(this.transformToInsertCra(this.listeCra));
    this.httpClient.delete(environment.urlCra, this.httpOptions).subscribe(
      response => {
        console.log('suppression -> ' + response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  getCraToServer(): void {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(this.firstDateWeekFormat, this.lastDateWeekFormat, '10');
    response.subscribe(reponse => {
      this.transform(reponse.liste_cra);
      for (const elem of this.listeCra) {
        elem.listeCr = [new CompteRendu(elem.id_cra, 'test', 0, '#F5E0E5'),
          new CompteRendu(elem.id_cra, 'test1', 0, '#C4DBFA'),
          new CompteRendu(elem.id_cra, 'test2', 0, '#DDF7DB')];
        this.listeCr = [new CompteRendu(elem.id_cra, 'test', 0, '#F5E0E5'),
          new CompteRendu(elem.id_cra, 'test1', 0, '#C4DBFA'),
          new CompteRendu(elem.id_cra, 'test2', 0, '#DDF7DB')];
      }
      this.emitCraSubject();
    });
  }

  addJour(date: Date, nbDays: number): string {
    const res = new Date(date);
    res.setDate(res.getDate() + nbDays);
    return formatDate(res, 'yyyy-MM-dd', 'fr');
  }

  addCraServer(): void {
    console.log('je rentre bien ici !! post');
    // tslint:disable-next-line:ban-types
    const listeCraWeek: InsertCra [] = [];
    for (let i = 0; i < 5; i++) {
      const cra = new InsertCra('0', '10', this.addJour(this.firstDateWeek, i), '0', '0', []);
      listeCraWeek.push(cra);
    }
    console.log(listeCraWeek);
    // const json =  JSON.stringify(listeCraWeek);
    // console.log(json);
    // this.httpClient.post(environment.urlCra, json, this.httpOptions).subscribe(
    //   response => {
    //     console.log(response);
    //   },
    //   error => {
    //     console.log(error + 'le serveur ne répond pas ');
    //   }
    // );

  }


  remplirTest() {
    for (let i = 0; i < 5; i++) {
      const cra = new Cra(0, 10, new Date(this.addJour(this.firstDateWeek, i)), 0, 0, []);
      cra.listeCr = [new CompteRendu(cra.id_cra, 'test', 0, '#F5E0E5'),
        new CompteRendu(cra.id_cra, 'test1', 0, '#C4DBFA'),
        new CompteRendu(cra.id_cra, 'test2', 0, '#DDF7DB')];
      this.listeCra.push(cra);
    }
    this.emitCraSubject();
  }
}
