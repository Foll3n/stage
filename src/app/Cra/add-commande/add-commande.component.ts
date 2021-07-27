import { Component, OnInit } from '@angular/core';
import {Projet} from '../models/projet/Projet';
import {Subscription} from 'rxjs';
import {ProjetService} from '../../../services/projet.service';
import {CommandeInsert} from '../models/commande/CommandeInsert';
import {RealisationPost} from '../models/realisation/RealisationPost';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommandeHttpDatabase} from '../../configuration/CommandeHttpDatabase';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProjetHttpDatabase} from '../../configuration/ProjetHttpDatabase';

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.scss']
})
export class AddCommandeComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders()
  };
  listeCommandeProjet!: CommandeInsert[];
  listeProjets!: Projet[];
  listeProjetSubscription!: Subscription;


  commandeProjet!: FormGroup;
  commandeUtilisateur!: FormGroup;

  constructor(private projetService: ProjetService, private httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });

    //Création des différents formulaires nécessaires
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeUtilisateur = new FormGroup({
      commande: new FormControl(),
      projet: new FormControl(),
      utilisateur: new FormControl()
    });
  }

  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
      (projets: Projet[]) => {this.listeProjets = projets;
      });

  }

  /**
   * retourne la taile de l'écran
   */
  public get width() {
    return window.innerWidth;
  }

  // addCommande(){
  //     this.commandeService.addCommande(this.commandeToInsert);
  //     this.listeCommande = [];
  // }

  /**
   * ajoute une commande à un projet. On créé la commande grâce aux champs du formulaire
   */
  addCommande(){
      if(this.commandeProjet){
        let commande = new CommandeInsert(this.commandeProjet.get('codeCommande')?.value, this.commandeProjet.get('projet')?.value , '' , '');
        const commandeHttp = new CommandeHttpDatabase(this.httpClient);
        const response = commandeHttp.addCommande(commande);
        response.subscribe(reponse => {
          if(reponse.status == 'OK'){
            console.log(reponse);
          }
          else{
            console.log("Erreur de requete de base de données");
          }
        });
        this.commandeProjet.reset();
      }
  }

  /**
   * Ajoute une commande à un utilisateur à l'aide du formulaire
   */
  addRealisation(){
    if(this.commandeUtilisateur){
      // let realisation = new RealisationPost(this.commandeUtilisateur.get('utilisateur')?.value, this.commandeUtilisateur.get('commande')?.value);
      let realisation = new RealisationPost('10', this.commandeUtilisateur.get('commande')?.value);
      console.log("ma réalisation" + realisation.id_com + " " + realisation.id_usr);
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
      const response = commandeHttp.addCommandeUser(realisation);
      response.subscribe(reponse => {
        if(reponse.status == 'OK'){
          console.log(reponse);
        }
        else{
          console.log("Erreur de requete de base de données");
        }

      });
      this.commandeUtilisateur.reset();
    }
}

  /**
   * Récupère la liste des commandes d'un projet
   * @param projet
   */
  getCommandeProjet(projet: Projet){

    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommandsProjet(projet.id);
    response.subscribe(reponse => {
      if (reponse.status =='OK'){
        console.log(reponse);
        this.listeCommandeProjet = reponse.listeCommande;
      }
      else{
        console.log("Erreur: getAllCommandesProjet");
      }

    });
  }

  /**
   * Récupère la liste de tous les projets et la met dans listeProjets (pas utilisé car on est abonné au projetService qui contient toujours la liste des projets à jour
    */
  getListeProjet(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllProjects();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeProjets = reponse.liste_projet;
      }
      else{
        console.log("Erreur de requete de base de données");
      }


    });
  }

}
