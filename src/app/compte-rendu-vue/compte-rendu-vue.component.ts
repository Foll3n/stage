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
      for(const cra of this.craService.listeCraWeek[this.index].listeCra){
        if (cra.status > 0){
          return false;
        }
      }
      return true;
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
