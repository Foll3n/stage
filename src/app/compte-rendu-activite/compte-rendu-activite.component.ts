import { Component, OnInit } from '@angular/core';
import {Cra} from '../models/Cra';
import {CompteRendu} from '../models/CompteRendu';
import {Subscription} from 'rxjs';
import {CraService} from '../../services/cra.service';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {CraWeek} from '../models/craWeek';

@Component({
  selector: 'app-compte-rendu-activite',
  templateUrl: './compte-rendu-activite.component.html',
  styleUrls: ['./compte-rendu-activite.component.scss'],
  styles: [`
     /*/deep/ .carousel-item.active {*/
     /*   border: solid 0.3em;*/
     /*   border-color: red;*/
     /*}*/
  `, `
     /deep/  .carousel-indicators> li {
 background-color: red;
}`


]
})
export class CompteRenduActiviteComponent implements OnInit {
  craWeek!: CraWeek[] ;
  selectedWeek = 0;
  listeCr: CompteRendu[] | undefined; // rajouter la liste des comptes rendus
  listeCraSubscription!: Subscription;
  listeCrSubscription!: Subscription;
  firstDate = '';
  lastDate = '';

  public get width() {
    return window.innerWidth;
  }
  constructor(private craService: CraService, config: NgbCarouselConfig) {
    config.interval = 0;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;


  }
  ngOnInit(){
    this.listeCraSubscription = this.craService.craSubject.subscribe(
      (craWeek: CraWeek[]) => {this.craWeek = craWeek;
                               this.firstDate = craWeek[this.selectedWeek].firstDate;
                               this.lastDate = craWeek[this.selectedWeek].lastDate;
        console.log(this.craWeek[this.selectedWeek] + "ffffffffffffffffffff>>>"+ this.selectedWeek);
                                }
  );
    this.listeCrSubscription = this.craService.crSubject.subscribe(
      (listeCr: CompteRendu[]) => this.listeCr = listeCr
    );
    console.log('test');
    this.craService.emitCraSubject();
  }
  addSousProjet(): void { ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
    this.craService.addCr(new CompteRendu(0, 'commande_test', 0.0, '#F5F3E0'));

  }

  getDay(): Date{
    return this.craService.listeCraWeek[this.selectedWeek].dayDate;
  }
  getListeCra(){
    return this.craWeek;
  }

  getDateToday(): string{
    return this.afficherjour(this.getDay().getDay()) + ' ' + this.craWeek[this.selectedWeek].dateToday;
  }

  getFirstDayWeek() {
    return this.craWeek[this.selectedWeek].firstDate;
  }

  getLastDayWeek() {
    return this.craWeek[this.selectedWeek].lastDate;
  }
  // select(slideId: string, source: NgbSlideEventSource){
  //   console.log("testttt"+slideId);
  // }
  push() {
    this.craService.addCraServer(this.selectedWeek);
  }



  delete() {
    this.craService.supprimer(this.selectedWeek);
  }

  findIndexToUpdate(cra: Cra) {
    // @ts-ignore
    return cra.id_cra === this;
  }

  // onFetch() {
  //  this.craService.getCraFromServer();



  // }
  onEdit(cra: Cra) {
    this.craService.editCra(cra, this.selectedWeek);
  }

  afficherjour(day: number): string {
    return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
  }

  test1(){
    console.log('pppppppppppppppppppp');
  }

  onSlide($event: NgbSlideEvent) {
    if($event.direction == 'left'){
      this.selectedWeek = (this.selectedWeek + 1) % 3;
    }
    if($event.direction == 'right'){
      this.selectedWeek = (this.selectedWeek - 1) % 3;
    }
    console.log("tttttttttttttttttttttttttttt"+$event.direction+"tttttttttttttttttttttttttttttt" + this.selectedWeek+this.craWeek);
  }
}
