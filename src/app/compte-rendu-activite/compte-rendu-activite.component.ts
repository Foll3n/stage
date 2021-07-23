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
  selectedWeek = 1;
  // @Input()
  // date!: number;

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

  /**
   * Récupère une commande précise réalisée par un utilisateur
   * @param num
   */
  public getCommandeById(num: string): Realisation {
    const commande = this.listeRealisations.find(
      (real) => real.num_commande === num);
    return commande as Realisation;
  }

  /**
   * Fonction permettant de vérifier si la réalisation d'un utilisateur est dans la liste des commandes
   * @param num_com
   */
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

  /**
   * Permet de renvoyer la liste des commandes possible à ajouter pour un utilisateur dans sa semaine
   */
  getAvailableCommande(){
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

  /**
   * renvoie la liste des commandes d'une semaine de cra
    */
  initListeCommandes(){

    this.listeCommande = this.craWeek[this.selectedWeek].listeCommandesWeek;

  }
  /**
  Met à jour la date de début de semaine et de fin de semaine afin de les afficher au dessus de mon calendrier
   */
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

  /**
   * Ajoute un compte rendu (appel API) -> ajoute une ligne dans mon emploi du temps à la semaine d'une commande précise
    * @param com
   */
  addSousProjet(com: CommandeInsert): void { ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
    if (!com.color){
      com.color = '';
    }
    const commande = new CommandeInsert(com.num_com, com.id_projet, com.id, com.color);    // id -> 1 ou id 2 pour le projet pour le moment et 2/5 pour id commande
    this.craService.addCr(new CompteRendu(0, com.id, 0.0, com.color), this.selectedWeek, commande);

  }

  /**
   * Renvoie la date du jour actuel
   */
  getDay(): Date{
    return new Date();
  }

  /**
   * Renvoie la date du jour sous forme de string que l'on utilise tout en haut de la page pour afficher la date du jour actuel
    */
  getDateToday(): string{
    return this.afficherjour(this.getDay().getDay()) + ' ' + this.craService.getDateToday();
  }


  // select(slideId: string, source: NgbSlideEventSource){
  //   console.log("testttt"+slideId);
  // }
  /**
   * Appuie sur le bouton enregistrer de notre IHM
   */
  push() {
    // this.craService.addCraServer(2);
    this.craService.saveCra(this.selectedWeek);
  }


  /**
   * Permet de supprimer tous les cras d'une semaine mais ne s'utilisera jamais
    */
  delete() {
    this.craService.supprimer(this.selectedWeek);
  }

  /**
   * Permet d'éditer un cran précis mais jamais utilisé car ce n'est pas le cra en lui meme que nous éditons
   * @param cra
   */
  onEdit(cra: Cra) {
    this.craService.editCra(cra, this.selectedWeek);
  }

  /**
   * Permet d'afficher le jour en français plutôt que sous forme de numéro
    * @param day
   */
  afficherjour(day: number): string {
    return ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
  }

  test1(){
    console.log('pppppppppppppppppppp');
  }

  /**
   * Fonction appelée lors du slide du caroussel qui permet de sélectionner le cra de la semaine dans la liste
   * @param $event
   */
  onSlide($event: NgbSlideEvent) {

    let res = ($event.current.split("-").pop());
    if (res)
    this.selectedWeek = +res;
    console.log("res :" + res);
    this.update();
  }

  /**
   * Fonction permettant d'initialiser les commandes Disponibles dans la semaine ainsi que d'initialiser les dates de la semaine
   */
  update(){
    console.log("je passe bien dans le update");
    this.initDates();
    this.initListeCommandes();
    this.getAvailableCommande();

    //this.craService.emitCraSubject();
  }

  /**
   * permet à l'utilisateur de valider sa semaine elle sera donc envoyé aux administrateurs afin qu'ils la valident définitivement
    */
  save(){
    this.craService.setStatusUser(this.selectedWeek, '1');
  }

  /**
   * Est ce que la semaine est correctement remplie ? c'est à dire que chaque jour à une durée totale à 1
    */
  canUpdateStatus(){
    for (const cra of this.craWeek[this.selectedWeek].listeCra){
      if (cra.duree_totale < 1 ){
        return false;
      }
    }
    return true;
  }

  /**
   * Permet de ne pas afficher le bouton si le status est validé
   */
  seeButton(){
    console.log("jhe suis au bouton "+ this.craWeek[this.selectedWeek].status);
    return this.craWeek[this.selectedWeek].status === '0';

  }

  /**
   * permet de renvoyer le status du cra à la semaine afin de gérer l'affichage en fonction de son status
   */
  seeMessage(){
    return +this.craWeek[this.selectedWeek].status;
}}
