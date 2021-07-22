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
    return this._httpClient.post<Projet>(href, json, this.httpOptions);
  }

  deleteProjet(projet: Projet){
    const href = environment.urlProjet + '/' + projet.id;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.delete(href, this.httpOptions);
  }
}
