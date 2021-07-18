import {Injectable} from '@angular/core';
import {Cra} from '../app/models/Cra';
import {Subject} from 'rxjs';
import {CompteRendu} from '../app/models/CompteRendu';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {environment} from '../environments/environment';
import {InsertCra} from '../app/models/InsertCra';
import {CraHttpDatabase} from '../app/configuration/CraHttpDatabase';
import {CraWeek} from '../app/models/craWeek';

@Injectable()
export class CraService {
  nb = 0;
  constructor(private httpClient: HttpClient) {




    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });

    this.listeCraWeek.push(this.craWeekLast);
    this.listeCraWeek.push(this.craWeek);
    this.listeCraWeek.push(this.craWeekNext);

    console.log(this.listeCraWeek);
    this.fillWeeks();
    console.log("--->"+this.listeCraWeek);
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  dateDay = new Date();

  listeCraWeek: CraWeek[] = [];
  craWeekLast: CraWeek = new CraWeek(0, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() - 7)));
  craWeek: CraWeek = new CraWeek(1, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));
  craWeekNext: CraWeek = new CraWeek(2, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));


  public listeCr: CompteRendu[] = [];
  craSubject = new Subject<CraWeek[]>();
  crSubject = new Subject<CompteRendu[]>();
  private listeCra: Cra[] = [];




  emitCraSubject(): void {
    // tslint:disable-next-line:triple-equals
        console.log('>>>>>>>>>>>>>>>>>>>' + this.listeCraWeek + '<<<<<<<<<<<<<<<<<<<');
        this.craSubject.next(this.listeCraWeek.slice());


        this.crSubject.next(this.listeCr.slice());
  }


  addCr(cr: CompteRendu, index: number): void {
    for (const cra of this.listeCraWeek[index].listeCra) {
      cra.listeCr.push(new CompteRendu(cra.id_cra, cr.numCommande, cr.duree, cr.color));
    }
    this.listeCr.push(cr);
    this.emitCraSubject();
  }

  addCra(cra: Cra, index: number): void {
    this.listeCraWeek[index].listeCra.push(cra);
    this.emitCraSubject();
  }

  public getCraById(id: number, index: number): Cra {
    const cra = this.listeCraWeek[index].listeCra.find(
      (craObject) => craObject.id_cra === id);
    return cra as Cra;
  }

  validUser(index: number): void {
    for (const cra of this.listeCraWeek[index].listeCra) {
      cra.status = 1;
    }
    this.emitCraSubject();
  }

  getDureeTotaleCra(idCra: number, index: number): number {
    return this.getCraById(idCra, index).duree_totale;
  }

  affichercra(index: number): void {
    console.log(this.listeCraWeek[index].listeCra);
  }

  findIndexToUpdate(cra: Cra): void {
    // @ts-ignore
    return cra.id_cra === this;
  }

  editCra(cra: Cra, index: number): void {
    const updateItem = this.listeCraWeek[index].listeCra.find(this.findIndexToUpdate, cra.id_cra);
    let ind = 0;
    if (updateItem instanceof Cra) {
      ind = this.listeCraWeek[index].listeCra.indexOf(updateItem);
    }
    this.listeCraWeek[index].listeCra[ind] = cra;
    this.emitCraSubject();

  }

  editCraDuree(idCra: number, duree: number, indexCr: number, indexCraWeek: number): void {
    const updateItem = this.listeCraWeek[indexCraWeek].listeCra.find(x => x.id_cra === idCra);
    // @ts-ignore
    if (updateItem instanceof Cra) {
      const index = this.listeCraWeek[indexCraWeek].listeCra.indexOf(updateItem);
      const save = this.listeCraWeek[indexCraWeek].listeCra[index].listeCr[indexCr].duree;
      this.listeCraWeek[indexCraWeek].listeCra[index].listeCr[indexCr].duree = duree;
      this.listeCraWeek[indexCraWeek].listeCra[index].duree_totale = +(this.listeCraWeek[indexCraWeek].listeCra[index].duree_totale - save + duree).toPrecision(2);
      this.emitCraSubject();
    }

  }

  // tslint:disable-next-line:variable-name
  public transform(liste_cra: InsertCra[], index: number): void {
    this.listeCraWeek[index].listeCra = [];
    for (const cra of liste_cra) {
      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.status;
      this.listeCraWeek[index].listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, cra.listeCr));
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
  // setCurrentWeek(index: number, ind:number){
  //   switch (index){
  //     case 0 : {this.listeCraWeek[ind] = this.craWeekLast; break; }
  //     case 1 : {this.listeCraWeek[ind] = this.craWeek; break; }
  //     case 2 : {this.listeCraWeek[ind] = this.craWeekNext; break; }
  //   }
  // }
  supprimer(index: number): void {
    const json = JSON.stringify(this.transformToInsertCra(this.listeCraWeek[index].listeCra));
    this.httpClient.delete(environment.urlCra, this.httpOptions).subscribe(
      response => {
        console.log('suppression -> ' + response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  getCraToServer(index: number): void {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, '10');
    response.subscribe(reponse => {
      this.transform(reponse.liste_cra, index);
      for (const elem of this.listeCraWeek[index].listeCra) {
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

  addCraServer(index: number): void {
    console.log('je rentre bien ici !! post');
    // tslint:disable-next-line:ban-types
    const listeCraWeek: InsertCra [] = [];
    for (let i = 0; i < 5; i++) {
      this.nb++;
      const cra = new InsertCra(this.nb.toString(), '10', this.addJour(this.listeCraWeek[index].firstDateWeek, i), '0', '0', []);
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

  fillWeeks(){

    this.getCraToServer( 0);
    this.getCraToServer( 1);
    this.getCraToServer(2);

    // this.selectedWeek = this.craWeekNext;
    // this.listeCra = this.selectedWeek.listeCra;
    // this.getCraToServer();
    // this.selectedWeek = this.craWeek;
    // this.listeCra = this.selectedWeek.listeCra;
  }

  remplirTest(craWeek: CraWeek) {
    for (let i = 0; i < 5; i++) {
      const cra = new Cra(this.nb, 10, new Date(this.addJour(craWeek.firstDateWeek, i)), 0, 0, []);
      cra.listeCr = [new CompteRendu(cra.id_cra, 'test', 0, '#F5E0E5'),
        new CompteRendu(cra.id_cra, 'test1', 0, '#C4DBFA'),
        new CompteRendu(cra.id_cra, 'test2', 0, '#DDF7DB')];
      craWeek.listeCra.push(cra);
    }
    this.emitCraSubject();
  }
}
