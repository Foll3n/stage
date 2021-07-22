import {Component, Input, OnInit} from '@angular/core';
import {Cra} from '../models/Cra';
import {CompteRendu} from '../models/CompteRendu';
import {Subscription} from 'rxjs';
import {CraService} from '../../services/cra.service';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {CraWeek} from '../models/craWeek';
import {CommandeInsert} from '../models/CommandeInsert';
import {UserService} from '../../services/user.service';
import {Realisation} from '../models/Realisation';

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
 background-color: cadetblue;
}`,
    `
     /deep/  .carousel-indicators {
       position: absolute;
       top : -20px;
       height: 20px;


}`
    // ,
    // `
    //   /deep/ .carousel-item.active {
    //     border: solid 0.3em;
    //     border-color: red;
    //   }
    // `


]
})
export class CompteRenduActiviteComponent implements OnInit {
  public craWeek!: CraWeek[] ;
  selectedWeek = 0;
  @Input()
  date!: number;

  listeCraSubscription!: Subscription;
  listeCrSubscription!: Subscription;
  firstDate = '';
  lastDate = '';
  listeCommande: CommandeInsert[] = [];
  listeRealisations: Realisation[] = [];
  realisationSubscription!: Subscription;
  listeAddCommande: CommandeInsert[] = [];

  public get width() {
    return window.innerWidth;
  }
  constructor(private craService: CraService, private userService: UserService, config: NgbCarouselConfig) {
    config.interval = 0;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
  }


  public getCommandeById(num: string): Realisation {
    const commande = this.listeRealisations.find(
      (real) => real.num_commande === num);
    return commande as Realisation;
  }
  checkRelInListeCommande(num_com: string): boolean{
    if (this.listeCommande){
      console.log('coucou' + this.listeCommande);
      for (const com of this.listeCommande){
        if (com.num_com === num_com){
          return true;
        }
      }

    }
    return false;
  }

  getAvailableCommande(){
    console.log('iiiiiiiiiiiiiiiiiii' + this.listeRealisations);
    this.listeAddCommande = [];
    for (const real of this.listeRealisations ){
      console.log(real.id + 'jjjjjjjjjjjj');
      if (!this.checkRelInListeCommande(real.num_commande) ) // listeCommande est la liste des commandes d'un cra
      {

            const commande = new CommandeInsert(real.num_commande, '0', real.id, real.color);
            this.listeAddCommande.push(commande);

      }
    }
  }

  initListeCommandes(){

    this.listeCommande = this.craWeek[this.selectedWeek].listeCommandesWeek;

  }
  initDates(){
    this.firstDate = this.craWeek[this.selectedWeek].firstDate;
    this.lastDate = this.craWeek[this.selectedWeek].lastDate;
  }
  ngOnInit(){
    this.listeCraSubscription = this.craService.craSubject.subscribe(
      (craWeek: CraWeek[]) => {this.craWeek = craWeek;
                               this.update();
                                });
    this.realisationSubscription = this.userService.realisationsSubject.subscribe(
      (realisations: Realisation[]) => {this.listeRealisations = realisations;
                                        this.update();
      });

    console.log('test');
    this.craService.emitCraSubject();
  }
  addSousProjet(com: CommandeInsert): void { ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
    console.log(com.color + ' pppppppppppppppppp ');
    if (!com.color){
      com.color = '';
    }
    console.log('je veux savoit le numero ' + this.selectedWeek + '    ' + com.id);
    const commande = new CommandeInsert(com.num_com, com.id_projet, com.id, com.color);    // id -> 1 ou id 2 pour le projet pour le moment et 2/5 pour id commande
    this.craService.addCr(new CompteRendu(0, com.id, 0.0, com.color), this.selectedWeek, commande);

  }

  getDay(): Date{
    return this.craService.dateDay;
  }
  getListeCra(){
    return this.craWeek;
  }

  getDateToday(): string{
    return this.afficherjour(this.getDay().getDay()) + ' ' + this.craService.getDateToday();
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
    // this.craService.addCraServer(2);
    this.craService.saveCra(this.selectedWeek);
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
    return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][day];
  }

  test1(){
    console.log('pppppppppppppppppppp');
  }

  onSlide($event: NgbSlideEvent) {

    console.log($event.current + ' 000000000');
    switch ($event.current){
      case 'ngb-slide-0': {
        this.selectedWeek = 0;
        break;
      }
      case 'ngb-slide-1': {
        this.selectedWeek = 1;
        break;
      }
      case 'ngb-slide-2': {
        this.selectedWeek = 2;
        break;
      }
      default: {
        this.selectedWeek = 1;
      }
    }

    this.update();
    console.log('tttttttttttttttttttttttttttt' + $event.direction + 'tttttttttttttttttttttttttttttt' + this.selectedWeek);
  }
  update(){
    this.initDates();
    this.initListeCommandes();
    this.getAvailableCommande();

    //this.craService.emitCraSubject();
  }
  save(){
    this.craService.setStatusUser(this.selectedWeek, '1');
  }
  canUpdateStatus(){
    for (const cra of this.craWeek[this.selectedWeek].listeCra){
      if (cra.duree_totale < 1 ){
        return false;
      }
    }
    return true;
  }
  seeButton(){
    console.log("jhe suis au bouton "+ this.craWeek[this.selectedWeek].status);
    return this.craWeek[this.selectedWeek].status === '0';

  }
  seeMessage(){
    return +this.craWeek[this.selectedWeek].status;
}}
