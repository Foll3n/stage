import {Component, Input, OnInit} from '@angular/core';
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
  @Input()
  listeCra!: Cra[];
  @Input()
  index!: number;
    listeCr: CompteRendu[] | undefined; // rajouter la liste des comptes rendus
    listeCrSubscription!: Subscription;

    constructor(private craService: CraService) {
    }

    public get width() {
        return window.innerWidth;
    }

    ngOnInit(){
        this.listeCrSubscription = this.craService.crSubject.subscribe(
            (listeCr: CompteRendu[]) => this.listeCr = listeCr
        );
        this.craService.emitCraSubject();
    }

    getDay(): Date{
        return this.craService.listeCraWeek[this.index].dayDate;
    }

    afficherjour(day: number): string {
        return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
    }
}
