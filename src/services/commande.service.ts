import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../app/configuration/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../app/Cra/models/realisation/Realisation';
import {Projet} from '../app/Cra/models/projet/Projet';
import {ProjetHttpDatabase} from '../app/configuration/ProjetHttpDatabase';
import {CommandeInsert} from '../app/Cra/models/commande/CommandeInsert';
import {RealisationPost} from '../app/Cra/models/realisation/RealisationPost';


@Injectable()
/**
 * Class non utilisée pour le moment
 */
export class CommandeService {
  userId = '10';
  listeCommandes: CommandeInsert[] = [];
  listeCommandesProjet: CommandeInsert[] = [];
  commandeSubject = new Subject<CommandeInsert[]>();
  commandeProjetSubject = new Subject<CommandeInsert[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitCommandeSubject(): void {
    this.commandeSubject.next(this.listeCommandes.slice());
  }
  emitCommandeProjetSubject(): void {
    this.commandeProjetSubject.next(this.listeCommandesProjet.slice());
  }

  addCommande(commande: CommandeInsert) {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.addCommande(commande);
    response.subscribe(reponse => {
      console.log(reponse);
      this.listeCommandes.push(commande);
      this.emitCommandeSubject();

    });
  }
  addCommandeUser(realisation: RealisationPost){
    console.log("ma réalisation" + realisation.id_com + " " + realisation.id_usr);
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.addCommandeUser(realisation);
    response.subscribe(reponse => {
      console.log("add commande user");

    });
  }
  getAllCommandesProjet(projet: Projet){
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommandsProjet(projet.id);
    response.subscribe(reponse => {
      if (reponse.status == 'OK'){

        console.log(reponse);
        this.listeCommandesProjet = reponse.listeCommande;
        this.emitCommandeProjetSubject();
      }
      else{
        console.log("Erreur: getAllCommandsProjet");
      }
    });
  }
}
