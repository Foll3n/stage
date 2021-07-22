import { Component, OnInit } from '@angular/core';
import {Projet} from '../models/Projet';
import {Subscription} from 'rxjs';
import {ProjetService} from '../../services/projet.service';
import {CommandeInsert} from '../models/CommandeInsert';
import {CommandeService} from '../../services/commande.service';
import {RealisationPost} from '../models/RealisationPost';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.scss']
})
export class AddCommandeComponent implements OnInit {

  listeCommande!: CommandeInsert[];
  listeCommandeProjet!: CommandeInsert[];
  listeProjets!: Projet[];
  listeProjetSubscription!: Subscription;
  listeCommandeSubscription!: Subscription;
  listeCommandeProjetSubscription!: Subscription;
  commandeToInsert: CommandeInsert = new CommandeInsert('', '', '', '');
  realisation: RealisationPost = new RealisationPost('11', '');


  commandeProjet!: FormGroup;
  commandeUtilisateur!: FormGroup;

  constructor(private projetService: ProjetService, private commandeService: CommandeService) {
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
      (projets: Projet[]) => {this.listeProjets = projets;
      });
    this.listeCommandeSubscription = this.commandeService.commandeSubject.subscribe(
      (commande: CommandeInsert[]) => {this.listeCommande = commande;
      });
    this.listeCommandeProjetSubscription = this.commandeService.commandeProjetSubject.subscribe(
      (commande: CommandeInsert[]) => {this.listeCommandeProjet = commande;
      });
  }
  public get width() {
    return window.innerWidth;
  }

  // addCommande(){
  //     this.commandeService.addCommande(this.commandeToInsert);
  //     this.listeCommande = [];
  // }
  addCommande(){
      if(this.commandeProjet){
        let commande = new CommandeInsert(this.commandeProjet.get('codeCommande')?.value, this.commandeProjet.get('projet')?.value , '' , '');
        this.commandeService.addCommande(commande);
        this.commandeProjet.reset();
      }
  }
  addRealisation(){
    this.commandeService.addCommandeUser(this.realisation);
}
  getCommandeProjet(projet: Projet){
      this.commandeService.getAllCommandesProjet(projet);
  }
}
