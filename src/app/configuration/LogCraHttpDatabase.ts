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
import {BigLog} from '../Cra/models/logCra/BigLog';
import {Log} from '../Cra/models/logCra/Log';


/**
 * Class qui regroupe l'ensemble des appels API de l'api Projet
 */
export class LogCraHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))});

  }
  // tslint:disable-next-line:variable-name
  getAllLogs(){
    const href = environment.urlLogCra;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigLog>(href, this.httpOptions);
  }
  addLog(log: Log){
    const json =  JSON.stringify(log);
    const href = environment.urlLogCra;
    console.log(log);
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<{ response:string }>(href, json, this.httpOptions);
  }


}
