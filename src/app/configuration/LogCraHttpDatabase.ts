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
import {ProjetAdd} from '../models/ProjetAdd';
import {BigLog} from '../models/BigLog';
import {Log} from '../models/Log';


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
