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


  listeCr: CompteRendu[] | undefined; // rajouter la liste des comptes rendus
  listeCraSubscription!: Subscription;
  listeCrSubscription!: Subscription;

  ngOnInit(){
    this.listeCraSubscription = this.craService.craSubject.subscribe(
      (listeCra: Cra[]) => this.listeCra = listeCra
    );
    this.listeCrSubscription = this.craService.crSubject.subscribe(
      (listeCr: CompteRendu[]) => this.listeCr = listeCr
    );
    console.log('test');
    this.craService.emitCraSubject();
  }

  addSousProjet(){ ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
   this.craService.addCr(new CompteRendu(0, 'commande_test', 0.0, '#F5F3E0'));

  }
  push(){
    this.craService.addCraServer();
  }
  test(){
    this.craService.getCraToServer();
  }
  delete(){
    this.craService.supprimer();
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
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  }
  public get width() {
    return window.innerWidth;
  }
}
