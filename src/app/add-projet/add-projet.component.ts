import { Component, OnInit } from '@angular/core';
import {Projet} from '../models/Projet';
import {ProjetService} from '../../services/projet.service';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.scss']
})
export class AddProjetComponent implements OnInit {
  projetAAjouter: Projet = new Projet('', '', '');
  constructor(private projetService: ProjetService) { }

  ngOnInit(): void {
  }
  addProjet(){
    this.projetService.addProjet(this.projetAAjouter);
  }
}
