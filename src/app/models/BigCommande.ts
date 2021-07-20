import {InsertCra} from './InsertCra';
import {Cra} from './Cra';
import {CommandeInsert} from './CommandeInsert';

export class BigCommande {
  constructor(
    public status: string,
    public listeCommande: CommandeInsert[]
  ) {}


}
