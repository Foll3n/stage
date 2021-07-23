import { Component, OnInit } from '@angular/core';
import {Projet} from '../models/Projet';
import {ProjetService} from '../../services/projet.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.scss']
})
export class AddProjetComponent implements OnInit {
  projet!: FormGroup;
  color = 'blue';
  modeRealisations: string[] = ['forfait','regie'];

  constructor(private projetService: ProjetService) {
    this.projet = new FormGroup({
      code_projet: new FormControl(),
      color: new FormControl(),
      modeRealisation: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  /**
   * Ajoute un projet grâce au service projetService ce qui permet d'avoir à tous moment la liste des projets
   */
  addProjet(){
    let projet = new Projet(this.projet.get('code_projet')?.value,this.color,'', this.projet.get('modeRealisation')?.value);
    this.projetService.addProjet(projet);
  }
}
