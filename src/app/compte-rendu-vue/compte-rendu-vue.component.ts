import {Component, OnInit} from '@angular/core';
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
    listeCra: Cra[] | undefined;
    listeCr: CompteRendu[] | undefined; // rajouter la liste des comptes rendus
    listeCraSubscription!: Subscription;
    listeCrSubscription!: Subscription;

    constructor(private craService: CraService) {
    }

    public get width() {
        return window.innerWidth;
    }

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

    addSousProjet():void { ///////////////////////////////////////////////
        // @ts-ignore
        // this.craService.getCraToServer();
        // this.craService.addCraServer();
        this.craService.addCr(new CompteRendu(0, 'commande_test', 0.0, '#F5F3E0'));

    }

    getDay(): Date{
        return this.craService.dayDate;
    }

    getDateToday():string{
        return this.afficherjour(this.getDay().getDay()) + ' ' + this.craService.dateToday;
    }

    getFirstDayWeek() {
        return this.craService.firstDate;
    }

    getLastDayWeek() {
        return this.craService.lastDate;
    }

    push() {
        this.craService.addCraServer();
    }

    test() {
        this.craService.getCraToServer();
    }

    delete() {
        this.craService.supprimer();
    }

    findIndexToUpdate(cra: Cra) {
        // @ts-ignore
        return cra.id_cra === this;
    }

    // onFetch() {
    //  this.craService.getCraFromServer();

    onSave() {
        this.craService.getCraToServer();
    }

    // }
    onEdit(cra: Cra) {
        this.craService.editCra(cra);
    }

    afficherjour(day: number): string {
        return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
    }
}
