import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';
import { InsertCra} from '../models/InsertCra';
import {Big} from '../models/Big';
import {BigCommande} from '../models/BigCommande';
import {BigRealisation} from '../models/BigRealisation';
import {CompteRendu} from '../models/CompteRendu';
import {CompteRenduInsert} from '../models/CompteRenduInsert';

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

}
