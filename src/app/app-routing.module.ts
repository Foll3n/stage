import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { AjouterComponent } from './ajouter/ajouter.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import {VisualisationCongesComponent} from './visualisation-conges/visualisation-conges.component';
import {CongesEnAttenteComponent} from './conges-en-attente/conges-en-attente.component';
import {CompteRenduVueComponent} from './compte-rendu-vue/compte-rendu-vue.component';
import {CompteRenduActiviteComponent} from './compte-rendu-activite/compte-rendu-activite.component';
import {AdministrationCraComponent} from './administration-cra/administration-cra.component';
import {AdministrationProjetComponent} from './administration-projet/administration-projet.component';

const routes: Routes = [
  { path: 'administration-projet', component : AdministrationProjetComponent},
  { path: 'compte-rendu-activite', component : CompteRenduActiviteComponent},
  { path: 'administration-cra', component : AdministrationCraComponent},
  { path: 'connexion', component: ConnexionComponent },
  { path: 'visualisation', component: VisualisationComponent },
  { path: 'ajouter', component: AjouterComponent },
  { path: 'utilisateurs', component: UtilisateursComponent },
  { path: 'visualisation-conges', component: VisualisationCongesComponent },
  { path: 'conges-en-attente', component: CongesEnAttenteComponent },
  { path: '',   redirectTo: '/connexion', pathMatch: 'full' },
  { path: '**', redirectTo: '/connexion' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationComponent, AjouterComponent, ConnexionComponent, UtilisateursComponent, VisualisationCongesComponent, CompteRenduVueComponent];
