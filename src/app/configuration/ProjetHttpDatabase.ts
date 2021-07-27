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
import {ProjetAdd} from '../Cra/models/projet/ProjetAdd';


/**
 * Class qui regroupe l'ensemble des appels API de l'api Projet
 */
export class ProjetHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))});

  }
  // tslint:disable-next-line:variable-name
  getAllProjects(){
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigProjet>(href, this.httpOptions);
  }
  addProjet(projet: Projet){
    const json =  JSON.stringify(projet);
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<ProjetAdd>(href, json, this.httpOptions);
  }

  deleteProjet(projet: Projet){
    const href = environment.urlProjet + '/' + projet.id;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.delete(href, this.httpOptions);
  }
}
