import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../app/configuration/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../app/Cra/models/realisation/Realisation';
import {Projet} from '../app/Cra/models/projet/Projet';
import {ProjetHttpDatabase} from '../app/configuration/ProjetHttpDatabase';


@Injectable()
export class ProjetService {
  userId = '10';
  listeProjet!: Projet[];
  projetSubject = new Subject<Projet[]>();

  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.chargerProjet();
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitProjetSubject(): void {
    this.projetSubject.next(this.listeProjet.slice());
  }

  addProjet(projet: Projet) {
    console.log(projet);
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.addProjet(projet);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        projet.id = reponse.idProjet;
        this.listeProjet.push(projet);
        this.emitProjetSubject();
      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }
  chargerProjet(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllProjects();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeProjet = reponse.liste_projet;
        this.emitProjetSubject();
      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }
}
