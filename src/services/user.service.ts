import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../app/configuration/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../app/Cra/models/realisation/Realisation';


@Injectable()
export class UserService {
  userId = '10';
  listeRealisations!: Realisation[];
  realisationsSubject = new Subject<Realisation[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getCommandeFromServer(this.userId);


  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  emitRealisationSubject(): void {
    this.realisationsSubject.next(this.listeRealisations.slice());
  }

  getCommandeFromServer(idUsr: string): void {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommandsUser(idUsr);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        this.listeRealisations = reponse.realisations;
        this.emitRealisationSubject();
      }
      else{
        console.log("Erreur : getAllCommandsUser");
      }

    });
  }

}
