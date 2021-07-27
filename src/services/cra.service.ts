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
import {CraWeekInsert} from '../app/models/craWeekInsert';
import {Result} from '../app/models/Result';

@Injectable()
/**
 * Service uniquement utilisable dans la vue du compte rendu à la semaine
 */
export class CraService {
  public back!: boolean;
  constructor(private httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.initialisation(new Date());
  }

  httpOptions = {
    headers: new HttpHeaders()
  };
  currentSlide!: number;
  dateToday!: Date;
  listeCraWeek!: CraWeek[];
  craWeekLast!: CraWeek ;
  craWeek!: CraWeek;
  craWeekNext!: CraWeek ;
  public listeCommandes: CommandeInsert[] = [];
  craSubject = new Subject<CraWeek[]>();
  private listeCra: Cra[] = [];

  /**
   * Initialise notre service du cra à la semaine en lui passant une date
   * @param date
   */
  initialisation(date: Date, back = false){
    this.back = back;

    this.dateToday = new Date();
    // this.listeCraWeek = [];
    // this.craWeekLast = new CraWeek(0, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() - 7)));
    // this.craWeek = new CraWeek(1, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));
    // this.craWeekNext = new CraWeek(2, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));
    // this.listeCraWeek.push(this.craWeekLast);
    // this.listeCraWeek.push(this.craWeek);
    // this.listeCraWeek.push(this.craWeekNext);
    // this.fillWeeks();
    this.initialisationMois(date);
    this.fillWeeks();
  }


  initialisationMois(date:Date) {
    let save = new Date(date);
    date.setDate(date.getDate());
    this.listeCraWeek = [];
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    var firstDate = new Date(year, month, 1);
    if (firstDate.getDay() > 1){
      firstDate.setDate(firstDate.getDate()-firstDate.getDay());
    }
    var lastDate = new Date(year, month+1, 1);
    if (lastDate.getDay()-1 > 0){
      lastDate.setDate(lastDate.getDate()+ ( 7 - lastDate.getDay()));
    }
    let id = 0;
    while (firstDate.getTime() < lastDate.getTime()){
      var diff = (save.getTime() - firstDate.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      console.log("save get time" , save.valueOf(), firstDate.valueOf(), diffDays);
      if ((diffDays) < 7){
        this.currentSlide  = id;
      }
      this.listeCraWeek.push(new CraWeek(id, firstDate));
      id++;
      firstDate.setDate(firstDate.getDate() + 7 );
    }
    console.log(this.listeCraWeek);


  }
  /**
   * permet d'envoyer à touts les composants abonées la liste de cra Semaine
   */
  emitCraSubject(): void {
    // tslint:disable-next-line:triple-equals
        this.craSubject.next(this.listeCraWeek.slice());
  }

  /**
   * Renvoie la date du jour en français dans un format particulier pour le titre
   */
  getDateToday(){
    return formatDate(this.dateToday, 'dd MMMM yyyy', 'fr');
  }

  /**
   * Ajoute une ligne correspondant à une commande précise dans la semaine actuelle
   * @param cr
   * @param index
   * @param commande
   */
  addCr(cr: CompteRendu, index: number, commande: CommandeInsert): void {
    const listeCr = [];
    for (const cra of this.listeCraWeek[index].listeCra) {
      const compteRendu = new CompteRendu(cra.id_cra, cr.numCommande, cr.duree, cr.color);
      cra.listeCr.push(compteRendu);
      listeCr.push(compteRendu);

    }
    this.addCraLine(index, listeCr, commande);


  }

  /**
   * Ajoute un cra à la liste des cras de la semaine
   * @param cra
   * @param index
   */
  addCra(cra: Cra, index: number): void {
    this.listeCraWeek[index].listeCra.push(cra);
    this.emitCraSubject();
  }

  /**
   * récupère un cra précis dans la liste des semaines de cra
   * @param id
   * @param index
   */
  public getCraById(id: number, index: number): Cra {
    const cra = this.listeCraWeek[index].listeCra.find(
      (craObject) => craObject.id_cra === id);
    return cra as Cra;
  }

  /**
   * Fonction inutile qui permet de mettre le status du congé à 1
   * @param index
   */
  validConge(index: number): void {
    for (const cra of this.listeCraWeek[index].listeCra) {
      cra.statusConge = 1;
    }
    this.emitCraSubject();
  }

  /**
   * renvoie la durée totale d'un cra particulier dans la liste des cra d'une semaine précise (number)
   * @param idCra
   * @param index
   */
  getDureeTotaleCra(idCra: number, index: number): number {
    return this.getCraById(idCra, index).duree_totale;
  }

  /**
   * Afficher un cra
    * @param index
   */
  affichercra(index: number): void {
    console.log(this.listeCraWeek[index].listeCra);
  }

  /**
   * fonction permettant de définir comment on compare deux cras
   * @param cra
   */
  findIndexToUpdate(cra: Cra): void {
    // @ts-ignore
    return cra.id_cra === this;
  }

  /**
   * Met à jour un cra précis donné en paramètre (jamais utilisé)
    * @param cra
   * @param index
   */
  editCra(cra: Cra, index: number): void {
    const updateItem = this.listeCraWeek[index].listeCra.find(this.findIndexToUpdate, cra.id_cra);
    let ind = 0;
    if (updateItem instanceof Cra) {
      ind = this.listeCraWeek[index].listeCra.indexOf(updateItem);
      this.listeCraWeek[index].listeCra[ind] = cra;
      this.emitCraSubject();
    }

  }

  /**
   * Permet de mettre à jour la durée d'un compte rendu passé en paramètre
   * @param idCra
   * @param duree
   * @param indexCr
   * @param indexCraWeek
   */
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

  /**
   * Transforme une liste d'objets de type InsertCra en liste de Cra que l'on set directement à notre listeCraWeek
    * @param liste_cra
   * @param index
   */
// tslint:disable-next-line:variable-name
  public transform(liste_cra: InsertCra[], index: number): void {
    this.listeCraWeek[index].listeCra = [];
    for (const cra of liste_cra) {

      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.statusConge;
      const listCr = [];
      if (cra.listeCr != null){
        for (const sp of cra.listeCr){
          listCr.push(new CompteRendu(id, sp.id_commande, +sp.duree, sp.color));
        }
      }
      this.listeCraWeek[index].listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
    }

  }
  /**
   * Fonction qui prend un tableau de cra en paramètre et renvoie un tableau d'insertCra
   */
  // tslint:disable-next-line:variable-name
  public transformToInsertCra(liste_cra: Cra[]): InsertCra[] {
    const res = [];
    for (const cra of liste_cra) {
      const id = cra.id_cra.toString();
      const idUsr = cra.id_usr.toString();
      const duree = cra.duree_totale.toString();
      const status = cra.statusConge.toString();
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
  /**
   * Appel API pour supprimer un cra à la semaine mais jamais utilisé
    * @param index
   */
  supprimer(index: number): void {
    const json = JSON.stringify(this.transformToInsertCra(this.listeCraWeek[index].listeCra));
    this.httpClient.delete<Result>(environment.urlCra, this.httpOptions).subscribe(
      response => {
        if(response.status == 'OK'){
          console.log(response);
        }
        else{
          console.log("Erreur de requete de base de données");
        }
        console.log('suppression -> ' + response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Appel API pour ajouter une ligne (une commande) à notre Cra de semaine
   * @param index
   * @param listeCompteRendu
   * @param commande
   */
  addCraLine(index: number, listeCompteRendu: CompteRendu[], commande: CommandeInsert){
    console.log('Ajout d une ligne dans le serveur');
    // tslint:disable-next-line:ban-types
    const listeCompte: CompteRenduInsert [] = [];

    for (const cr of listeCompteRendu){
      listeCompte.push(new CompteRenduInsert(cr.idCra.toString(), cr.numCommande, '0.0', cr.color));
    }
    const json =  JSON.stringify(listeCompte);
    console.log(json);
    this.httpClient.post<Result>(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        if(response.status == 'OK'){
          console.log(response);
          // this.getDistinctCommandsWeek(index);
          if (this.listeCraWeek[index].listeCommandesWeek){
            this.listeCraWeek[index].addCom(commande); ///////////////////////////////////////////////////////////////////////////////
          }
          else{
            this.listeCraWeek[index].setListeCom([commande]);
          }
          this.emitCraSubject();
        }
        else{
          console.log("Erreur de requete de base de données");
        }
        console.log(response);

      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Récupère la liste des cras en lui passant l'index de la semaine à récupérer
   * @param index
   */
  getCraToServer(index: number): void {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, '10');
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        if (reponse.liste_cra != null){

          this.transform(reponse.liste_cra, index);
          this.getCraWeekStatus(index);
        }else{
          this.addCraWeek(index);

          //this.getCraToServer(index);
        }
        this.getDistinctCommandsWeek(index);
      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }

  /**
   * Récupère la liste des commandes d'une semaine pour un utilisateur
   * @param index
   */
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

  /**
   * Ajoute + 1 à la date actuelle et renvoie le résultat sous forme de string bien formé
    * @param date
   * @param nbDays
   */
  addJour(date: Date, nbDays: number): string {
    const res = new Date(date);
    res.setDate(res.getDate() + nbDays);
    return formatDate(res, 'yyyy-MM-dd', 'fr');
  }

  /**
   * Sauvegarde une semaine de CRA
    * @param index
   */
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
    this.httpClient.put<Result>(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        if(response.status == 'OK'){
          console.log(response);
        }
        else{
          console.log("Erreur de requete de base de données");
        }
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * renvoie le status du cra Semaine passé en paramètre
   * @param index
   */
  getCraWeekStatus(index: number): void{
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekStatus(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, '10');

    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(" je récupère le status" + reponse);
        this.listeCraWeek[index].setStatus(reponse.statusCra);
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm" + reponse.statusCra );
        this.emitCraSubject();
      }
      else {
        console.log("Erreur de requete de base de données");
      }
    });
  }

  /**
   * Appel API pour ajouter une semaine de cra
    * @param index
   */
  addCraWeek(index: number){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.addCraWeek(new CraWeekInsert(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, '0', '10'));
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.addCraServer(index);
      }
      else{
        console.log("Erreur de requete de base de données");
      }
      //this.emitCraSubject();
    });
  }

  /**
   * Met à jour le statusCra d'une semaine précise d'un utilisateur
    * @param index
   * @param status
   */
  updateStatusCraUtilisateur(index: number, status: string){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(new CraWeekInsert(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, status, '10'));
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeCraWeek[index].status = status;
        console.log("liste craweek index "+ this.listeCraWeek[index].status);
        this.emitCraSubject();
      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }

  /**
   * Appel API afin d'ajouter des cras en base de donnée
    * @param index
   */
  addCraServer(index: number): void {
    console.log('je rentre bien ici !! post');
    // tslint:disable-next-line:ban-types
    const listeCraWeek: InsertCra [] = [];
    for (let i = 0; i < 5; i++) {
      const cra = new InsertCra('', '10', this.addJour(this.listeCraWeek[index].firstDateWeek, i), '0', '0', []);
      listeCraWeek.push(cra);
    }
    const json =  JSON.stringify(listeCraWeek);
    console.log(json);
    this.httpClient.post<Result>(environment.urlCra, json, this.httpOptions).subscribe(
      response => {
        console.log(response);
        if(response.status == 'OK'){
          console.log(response);
          this.getCraToServer(index);
        }
        else{
          console.log("Erreur de requete de base de données");
        }
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * remplie trois semaines de CRA
   */
  fillWeeks(){
    for(let i=0; i< this.listeCraWeek.length;i++){
      this.getCraToServer(i);
    }
  //
  // this.getCraToServer( 1);
  // this.getCraToServer(2);

    // this.selectedWeek = this.craWeekNext;
    // this.listeCra = this.selectedWeek.listeCra;
    // this.getCraToServer();
    // this.selectedWeek = this.craWeek;
    // this.listeCra = this.selectedWeek.listeCra;
  }

  /**
   * supprime une ligne correspondant à une commande précise dans notre semaine (suppression des comptes rendus)
   * @param commande
   * @param index
   */
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

  /**
   * Set status congé jamais utilisé car on ne modifie jamais le status du congé
    * @param index
   */
  setStatusCongeUserToServer(index: number){
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

  /**
   * Met à jour le status d'un craWeek (validé par l'utilisateur)
   * @param index
   * @param status
   */
  setStatusUser(index: number, status: string){
    this.updateStatusCraUtilisateur(index, status);
  }

  /**
   * Appel API plus au service pour supprimer une ligne dans notre cra à la semaine (c'est à dire supprimer une commande)
   *
   * @param commande
   * @param index
   */
  deleteLine(commande: CommandeInsert, index: number){
    for (const cra of this.listeCraWeek[index].listeCra){
      for (const cr of cra.listeCr){
        // tslint:disable-next-line:triple-equals
        if (cr.numCommande == commande.id){
          const ind =  cra.listeCr.indexOf(cr, 0);
          cra.duree_totale -= cr.duree;
          cra.listeCr.splice(ind, 1);

        }
      }
    }
    const comToDelete = this.listeCraWeek[index].listeCommandesWeek.indexOf(commande);
    this.listeCraWeek[index].listeCommandesWeek.splice(comToDelete, 1);
  }
}
