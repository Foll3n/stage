import {CompteRendu} from './CompteRendu';
import {CompteRenduInsert} from './CompteRenduInsert';

export class InsertCra {
  constructor(
    public id_cra: string,
    public id_usr: string,
    public date: string,
    public duree_totale: string,
    public statusConge: string,
    public listeCr: CompteRenduInsert[],
    public status?: string

  ) {}
}
