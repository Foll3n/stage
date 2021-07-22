import { Component, OnInit } from '@angular/core';
import {CraHttpDatabase} from '../configuration/CraHttpDatabase';
import {ProjetHttpDatabase} from '../configuration/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Projet} from '../models/Projet';
import {ProjetService} from '../../services/projet.service';
import {CraWeek} from '../models/craWeek';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-administration-projet',
  templateUrl: './administration-projet.component.html',
  styleUrls: ['./administration-projet.component.scss']
})
export class AdministrationProjetComponent implements OnInit {

  projetAAjouter: Projet = new Projet('', '', '');
  listeProjets!: Projet[];
  listeProjetSubscription!: Subscription;
  color = '';
  constructor(private projetService: ProjetService) { }

  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
      (projets: Projet[]) => {this.listeProjets = projets;
      });
  }
  public get width() {
    return window.innerWidth;
  }



}
