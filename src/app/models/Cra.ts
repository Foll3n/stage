import {CompteRendu} from './CompteRendu';

export class Cra {
  constructor(
    public id_cra: number,
    public id_usr: number,
    public date: Date,
    public duree_totale: number,
    public status: number,
    public listeCr: CompteRendu[]
  ) {}
}
