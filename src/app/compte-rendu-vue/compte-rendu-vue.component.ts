import {Component, Input, OnInit} from '@angular/core';
import {Cra} from '../models/Cra';
import {CraService} from '../../services/cra.service';
import {Subscription} from 'rxjs';
import {CompteRendu} from '../models/CompteRendu';
import {CraWeek} from '../models/craWeek';
import {CommandeInsert} from '../models/CommandeInsert';

@Component({
    selector: 'app-compte-rendu-vue',
    templateUrl: './compte-rendu-vue.component.html',
    styleUrls: ['./compte-rendu-vue.component.scss']
})
export class CompteRenduVueComponent implements OnInit {
  @Input()
  index!: number;
  @Input()
  craWeek!: CraWeek;
    // listeCr: CompteRendu[] = []; // rajouter la liste des comptes rendus
  listeCraSubscription!: Subscription;
  listeCommande: CommandeInsert[] = [];
    constructor(public craService: CraService) {
    }

    public get width() {
        return window.innerWidth;
    }
  canDelete(){
     return this.craWeek.status === '0';
  }
    ngOnInit(){
      console.log("je suis la !!" + this.craWeek);
      //this.craWeek.listeCommandesWeek;
      // this.listeCraSubscription = this.craService.craSubject.subscribe(
      //   (craWeek: CraWeek[]) => {this.listeCra = craWeek[this.index].listeCra;
      //                            this.listeCommande = craWeek[this.index].listeCommandesWeek;
      //   }
      // );
      // this.craService.emitCraSubject();
    }
  getStatus(){
      return +this.craWeek.status;
  }
    getDay(): Date{
        return new Date();
    }
    deleteLine(commande: CommandeInsert){
        this.craService.deleteLineToServer(commande, this.index);
    }
    afficherjour(day: number): string {
        return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
    }
}
