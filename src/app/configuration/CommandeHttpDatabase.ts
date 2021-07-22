import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';
import { InsertCra} from '../models/InsertCra';
import {Big} from '../models/Big';
import {BigCommande} from '../models/BigCommande';
import {BigRealisation} from '../models/BigRealisation';
import {CompteRendu} from '../models/CompteRendu';
import {CompteRenduInsert} from '../models/CompteRenduInsert';
import {BigProjet} from '../models/BigProjet';
import {Projet} from '../models/Projet';
import {CommandeInsert} from '../models/CommandeInsert';
import {RealisationPost} from '../models/RealisationPost';

export class CommandeHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))});

  }
  // tslint:disable-next-line:variable-name
  getAllCommandsUser(id_usr: string){
    const href = environment.urlRealisation;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + id_usr;
    return this._httpClient.get<BigRealisation>(requestUrl, this.httpOptions);
  }
  // tslint:disable-next-line:variable-name
  getAllCommandsProjet(code_projet: string){
    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + '?code_projet=' + code_projet;
    return this._httpClient.get<BigCommande>(requestUrl, this.httpOptions);
  }
  addCommande(commande: CommandeInsert){
    const json =  JSON.stringify(commande);
    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post(href, json, this.httpOptions);
  }

  addCommandeUser(realisation: RealisationPost){
    const href = environment.urlRealisation;
    const json =  JSON.stringify(realisation);
    return this._httpClient.post(href, json, this.httpOptions);
  }
  deleteCommandeUser(realisation: RealisationPost){
    const href = environment.urlRealisation;
    const requestUrl = href + '/?id_usr=' + realisation.id_usr + '&id_com=' + realisation.id_com;
    return this._httpClient.delete(requestUrl, this.httpOptions);
  }
}
