import {CompteRendu} from './CompteRendu';
import {CompteRenduInsert} from './CompteRenduInsert';

export class Projet {
  constructor(
    public code_projet: string,
    public color: string,
    public id: string,
    public modeRealisation: string


  ) {}
}
