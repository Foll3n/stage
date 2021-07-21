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
  listeCra: Cra[] = [];
  @Input()
  index!: number;
    listeCr: CompteRendu[] = []; // rajouter la liste des comptes rendus
  listeCraSubscription!: Subscription;
  listeCommande: CommandeInsert[] = [];
    constructor(public craService: CraService) {
    }

    public get width() {
        return window.innerWidth;
    }
  canDelete(){
     return this.craService.listeCraWeek[this.index].status === '0';
  }
    ngOnInit(){
      console.log("je suis la !!");

      this.listeCraSubscription = this.craService.craSubject.subscribe(
        (craWeek: CraWeek[]) => {this.listeCra = craWeek[this.index].listeCra;
                                 this.listeCommande = craWeek[this.index].listeCommandesWeek;
        }
      );
      this.craService.emitCraSubject();
    }
  getStatus(){
      console.log("status ahahhahahah "+ this.craService.listeCraWeek[this.index].status);
      return +this.craService.listeCraWeek[this.index].status;
  }
    getDay(): Date{
        return this.craService.dateDay;
    }
    deleteLine(commande: CommandeInsert){
        this.craService.deleteLineToServer(commande, this.index);
    }
    afficherjour(day: number): string {
        return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
    }
}
