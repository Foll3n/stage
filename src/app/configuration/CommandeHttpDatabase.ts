import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';
import { InsertCra} from '../Cra/models/cra/InsertCra';
import {Big} from '../Cra/models/cra/Big';
import {BigCommande} from '../Cra/models/commande/BigCommande';
import {BigRealisation} from '../Cra/models/realisation/BigRealisation';
import {CompteRendu} from '../Cra/models/compteRendu/CompteRendu';
import {CompteRenduInsert} from '../Cra/models/compteRendu/CompteRenduInsert';
import {BigProjet} from '../Cra/models/projet/BigProjet';
import {Projet} from '../Cra/models/projet/Projet';
import {CommandeInsert} from '../Cra/models/commande/CommandeInsert';
import {RealisationPost} from '../Cra/models/realisation/RealisationPost';
import {Result} from '../Cra/models/Result';

/**
 * Class qui regroupe l'ensemble des appels API de l'api Commande
 */
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
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }

  addCommandeUser(realisation: RealisationPost){
    const href = environment.urlRealisation;
    const json =  JSON.stringify(realisation);
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }
  deleteCommandeUser(realisation: RealisationPost){
    const href = environment.urlRealisation;
    const requestUrl = href + '/?id_usr=' + realisation.id_usr + '&id_com=' + realisation.id_com;
    return this._httpClient.delete(requestUrl, this.httpOptions);
  }
}
