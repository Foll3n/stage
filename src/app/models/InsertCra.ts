import {CompteRendu} from './CompteRendu';

export class InsertCra {
  constructor(
    public id_cra: string,
    public id_usr: string,
    public date: string,
    public duree_totale: string,
    public status: string,
    public listeCr: CompteRendu[]
  ) {}
}
