import {CompteRendu} from './CompteRendu';

export class Cra {
  constructor(
    public idCra: number,
    public idUsr: number,
    public date: Date,
    public duree: number,
    public status: number,
    public listeSousProjet: CompteRendu[]
  ) {}
}
