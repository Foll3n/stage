import { Component, OnInit } from '@angular/core';
import {CraWeekInsert} from '../models/craWeekInsert';
import {CraHttpDatabase} from '../configuration/CraHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Cra} from '../models/Cra';
import {CraService} from '../../services/cra.service';
import {CraWeek} from '../models/craWeek';
import {InsertCra} from '../models/InsertCra';
import {CompteRendu} from '../models/CompteRendu';

@Component({
  selector: 'app-administration-cra',
  templateUrl: './administration-cra.component.html',
  styleUrls: ['./administration-cra.component.scss']
})
export class AdministrationCraComponent implements OnInit {

  display = false;
  listeCraWaiting: CraWeekInsert[] = [];
  listeCraValidate: CraWeekInsert[] = [];
  actualWeek!: CraWeek | undefined;
  constructor(private httpClient: HttpClient, private craService: CraService) {
    this.fillListeCraWaiting();
    this.fillListeCraValidate();
    this.listeCraValidate = this.sortList(this.listeCraValidate);
  }

  ngOnInit(): void {
  }
  public getCraWeek(cra: CraWeekInsert): CraWeekInsert | null {
    if (cra.idCra){
      const res = this.listeCraWaiting.find(
        (c) => c.idCra === cra.idCra);
      return res as CraWeekInsert;
    }
    return null;
  }
  notDisplay(){
    this.display=false;
  }
  fillListeCraWaiting(){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekWaiting(1);
    response.subscribe(reponse => {
      this.listeCraWaiting = this.sortList(reponse.listeCraWeek);
      console.log(this.listeCraWaiting);
    });
  }



  fillListeCraValidate(){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekWaiting(2);

    response.subscribe(reponse => {
      this.listeCraValidate = this.sortList(reponse.listeCraWeek);
    });
  }
  deleteCraWait(cra: CraWeekInsert){
    const c = this.getCraWeek(cra);
    if (c){
      const index = this.listeCraWaiting.indexOf(c, 0);
      this.listeCraWaiting.splice(index, 1);
    }
  }
  consulter(cra: CraWeekInsert){
    //this.craService.initialisation(new Date(cra.dateStart), true);
    this.actualWeek = new CraWeek(0, new Date(cra.dateStart));
    this.actualWeek.status = cra.status;

    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(cra.dateStart, cra.dateEnd, '10');
    response.subscribe(reponse => {
      this.transform(reponse.liste_cra);

    });
  }

  public transform(liste_cra: InsertCra[]): void {
    console.log("je suis ici ahahhahahhahahaha");
    // tslint:disable-next-line:no-non-null-assertion
    this.actualWeek!.listeCra = [];
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
      this.actualWeek!.listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
    }
  }
  validerCra(cra: CraWeekInsert){
    this.actualWeek = undefined;
    cra.status = '2';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      this.deleteCraWait(cra);
      this.listeCraValidate.push(cra);
      this.listeCraValidate = this.sortList(this.listeCraValidate);
    });
    }
  refuserCra(cra: CraWeekInsert){
    this.actualWeek = undefined;
    cra.status = '0';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      this.deleteCraWait(cra);
    });
  }
  sortList(liste: CraWeekInsert[]){
    const sortedArray: CraWeekInsert[] = liste.sort((obj1, obj2) => {
      if (obj1.dateStart < obj2.dateStart) {
        return 1;
      }
      else{
        return -1;
      }
      return 0;
    });
    return sortedArray;
  }
  test(){
    console.log("test");
  }

}
