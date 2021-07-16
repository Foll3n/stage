import { Component, OnInit } from '@angular/core';
import {Cra} from '../models/Cra';
import {CraService} from '../../services/cra.service';
import {Subscription} from 'rxjs';
import {CompteRendu} from '../models/CompteRendu';

@Component({
  selector: 'app-compte-rendu-vue',
  templateUrl: './compte-rendu-vue.component.html',
  styleUrls: ['./compte-rendu-vue.component.scss']
})
export class CompteRenduVueComponent implements OnInit {

  constructor(private craService: CraService) { }


  listeCra: Cra[] | undefined;
  listeCr: CompteRendu[] | undefined; //rajouter la liste des comptes rendus

  listeCraSubscription!: Subscription;

  ngOnInit(){
    this.listeCraSubscription = this.craService.craSubject.subscribe(
      (listeCra: Cra[]) => this.listeCra = listeCra
    );

    console.log('test');
    this.craService.emitCraSubject();
  }

  addSousProjet(){ ///////////////////////////////////////////////
    // @ts-ignore
    //this.craService.getCraToServer();
    this.craService.addCraServer();
   //this.craService.addCr(new CompteRendu(0, 'commande_test', 0.0, 'red'));

  }
  findIndexToUpdate(cra: Cra) {
    // @ts-ignore
    return cra.id_cra === this;
  }
  onSave() {
    this.craService.getCraToServer();
  }
  // onFetch() {
  //  this.craService.getCraFromServer();
  // }
  onEdit(cra: Cra){
    this.craService.editCra(cra);
  }
  afficherjour(day: number): string{
    switch (day){
      case 0 : {
        return 'Dimanche';
      }
      case 1 : {
        return 'lundi';
      }
      case 2 : {
        return 'Mardi';
      }
      case 3 : {
        return 'Mercredi';
      }
      case 4 : {
        return 'Jeudi';
      }
      case 5 : {
        return 'Vendredi';
      }
      case 6 : {
        return 'Samedi';
      }
      default : {
        return 'Error';
      }
    }
  }
}
