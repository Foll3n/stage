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
import {CompteRenduInsert} from '../app/models/CompteRenduInsert';
import {CommandeInsert} from '../app/models/CommandeInsert';
import {BigCommande} from '../app/models/BigCommande';

@Injectable()
export class CraService {
  nb = 0;
  constructor(private httpClient: HttpClient) {
    this.dateDay = new Date();



    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    console.log('first' + this.craWeek.toString());
    console.log('first' + this.craWeek.toString());
    this.listeCraWeek.push(this.craWeekLast);
    this.listeCraWeek.push(this.craWeek);
    this.listeCraWeek.push(this.craWeekNext);
    this.fillWeeks();
    console.log("llllll lll lll lll "+ this.listeCraWeek);




  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  dateDay = new Date();
  dateToday = new Date();
  listeCraWeek: CraWeek[] = [];
  craWeekLast: CraWeek = new CraWeek(0, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() - 7)));
  craWeek: CraWeek = new CraWeek(1, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));
  craWeekNext: CraWeek = new CraWeek(2, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));


  public listeCommandes: CommandeInsert[] = [];
  craSubject = new Subject<CraWeek[]>();
  private listeCra: Cra[] = [];




  emitCraSubject(): void {
    // tslint:disable-next-line:triple-equals
        this.craSubject.next(this.listeCraWeek.slice());
  }

  getDateToday(){
    return formatDate(this.dateToday, 'dd MMMM yyyy', 'fr');
  }
  addCr(cr: CompteRendu, index: number, commande: CommandeInsert): void {
    const listeCr = [];
    for (const cra of this.listeCraWeek[index].listeCra) {
      const compteRendu = new CompteRendu(cra.id_cra, cr.numCommande, cr.duree, cr.color);
      cra.listeCr.push(compteRendu);
      listeCr.push(compteRendu);

    }
    this.addCraLine(index, listeCr, commande);


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
      const listCr = [];
      if (cra.listeCr != null){
        for (const sp of cra.listeCr){
          listCr.push(new CompteRendu(id, sp.id_commande, +sp.duree, sp.color));
        }
      }
      this.listeCraWeek[index].listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
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
      const listCr = [];
      for (const sp of cra.listeCr){
        listCr.push(new CompteRenduInsert(id, sp.numCommande, duree, sp.color));
      }
      res.push(new InsertCra(id, idUsr, formatDate(cra.date, 'yyyy-MM-dd', 'fr'), duree, status, listCr));
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

  addCraLine(index: number, listeCompteRendu: CompteRendu[], commande: CommandeInsert){
    console.log('Ajout d une ligne dans le serveur');
    // tslint:disable-next-line:ban-types
    const listeCompte: CompteRenduInsert [] = [];

    for (const cr of listeCompteRendu){
      listeCompte.push(new CompteRenduInsert(cr.idCra.toString(), cr.numCommande, '0.0', cr.color));
    }
    const json =  JSON.stringify(listeCompte);
    console.log(json);
    this.httpClient.post(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        console.log(response);
       // this.getDistinctCommandsWeek(index);
        if (this.listeCraWeek[index].listeCommandesWeek){
          this.listeCraWeek[index].addCom(commande); ///////////////////////////////////////////////////////////////////////////////
        }
        else{
          this.listeCraWeek[index].setListeCom([commande]);
        }
        this.emitCraSubject();
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
      console.log(reponse);
      if (reponse.liste_cra != null && reponse.liste_cra.length > 0){

        this.transform(reponse.liste_cra, index);
        // for (const elem of this.listeCraWeek[index].listeCra) {
        //   elem.listeCr = [new CompteRendu(elem.id_cra, 'test', 0, '#F5E0E5'),
        //     new CompteRendu(elem.id_cra, 'test1', 0, '#C4DBFA'),
        //     new CompteRendu(elem.id_cra, 'test2', 0, '#DDF7DB')];
        //   this.listeCr = [new CompteRendu(elem.id_cra, 'test', 0, '#F5E0E5'),
        //     new CompteRendu(elem.id_cra, 'test1', 0, '#C4DBFA'),
        //     new CompteRendu(elem.id_cra, 'test2', 0, '#DDF7DB')];
        // }
        // this.emitCraSubject();
      }else{
            this.addCraServer(index);
      }
      this.getDistinctCommandsWeek(index);
    });
  }
  getDistinctCommandsWeek(index: number): void{
    const requestUrl = environment.urlCommande + '/' + this.listeCraWeek[index].firstDateWeekFormat + '/' + this.listeCraWeek[index].lastDateWeekFormat + '/' + '10' ;
    this.httpClient.get<BigCommande>(requestUrl, this.httpOptions).subscribe(
      response => {
        this.listeCraWeek[index].listeCommandesWeek = response.listeCommande;
        // this.getCraToServer(index); // patch car je reload tout le serveur
        this.emitCraSubject();
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }
  addJour(date: Date, nbDays: number): string {
    const res = new Date(date);
    res.setDate(res.getDate() + nbDays);
    return formatDate(res, 'yyyy-MM-dd', 'fr');
  }
  saveCra(index: number){
    console.log('je passe bien ici');
    const send: CompteRenduInsert[] = [];
    for (const cra of this.listeCraWeek[index].listeCra){
      for (const cr of cra.listeCr){
        send.push(new CompteRenduInsert(cr.idCra.toString(), cr.numCommande.toString(), cr.duree.toString(), cr.color));
      }
    }
    console.log(send);
    const json =  JSON.stringify(send);
    this.httpClient.put(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
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
    const json =  JSON.stringify(listeCraWeek);
    console.log(json);
    this.httpClient.post(environment.urlCra, json, this.httpOptions).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
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
  deleteLineToServer(commande: CommandeInsert, index: number){
    console.log("ooooooooooooooooo ooooooooo "+ commande.id);
    const requestUrl = environment.urlCr +'?commande=' + commande.id + '&date_start=' + this.listeCraWeek[index].firstDateWeekFormat + '&date_end=' + this.listeCraWeek[index].lastDateWeekFormat  + '&id_usr=' + '10' ;
    this.httpClient.delete(requestUrl, this.httpOptions).subscribe(
      response => {
        console.log(response);
        this.deleteLine(commande, index);
        this.emitCraSubject();
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }
  setStatusUserToServer(index: number){
    console.log('je passe bien ici dans l update de status');
    const json =  JSON.stringify(this.transformToInsertCra(this.listeCraWeek[index].listeCra));
    console.log(json);
    this.httpClient.put(environment.urlCra, json, this.httpOptions).subscribe(
      response => {
        console.log("probleme de status a jour" + response);
      },
      error => {
       // this.setStatusUser(index, 0); // s'il y a une erreur je remet le status a 0
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }
  setStatusUser(index: number, status: number){
    for (const cra of this.listeCraWeek[index].listeCra){
      cra.status = status;
      console.log("cra : ", cra.status);
    }
  }
  deleteLine(commande: CommandeInsert, index: number){
    for (const cra of this.listeCraWeek[index].listeCra){
      for (const cr of cra.listeCr){
        // tslint:disable-next-line:triple-equals
        if (cr.numCommande == commande.id){
          const ind =  cra.listeCr.indexOf(cr, 0);
          cra.listeCr.splice(ind, 1);
        }
      }
    }
    const comToDelete = this.listeCraWeek[index].listeCommandesWeek.indexOf(commande);
    this.listeCraWeek[index].listeCommandesWeek.splice(comToDelete, 1);
  }
}
