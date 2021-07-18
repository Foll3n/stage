import {Component, Input, OnInit} from '@angular/core';
import {CraService} from '../../services/cra.service';

@Component({
  selector: 'app-compte-rendu',
  templateUrl: './compte-rendu.component.html',
  styleUrls: ['./compte-rendu.component.scss']
})
export class CompteRenduComponent implements OnInit {
  @Input()
  duree!: number;
  @Input()
  color!: string;
  @Input()
  index!: number;
  @Input()
  idCra!: number;
  @Input()
  indexWeek!: number;
  isInsideComponent = false;
  dureeString: string = '';

  constructor(private craService: CraService) {

  }

  //ngOnChanges(changes: SimpleChanges) {
  //for (const prop in changes){
  //if (changes.hasOwnProperty(prop)){
  //switch (prop){
  //case 'duree': {
  //console.log('la durée a été changé');
  //}
  //}
  //}
  //}
  //console.log('je change');
  //}

  supprimer() {
    this.onModifyCase();
  }

  ngOnInit(): void {

  }


  onModifyCase() {

    this.craService.editCraDuree(this.idCra, +this.dureeString, this.index, this.indexWeek);
    this.craService.getCraById(this.idCra, this.indexWeek);
  }

  checkDureeTotale() {
    return this.craService.getDureeTotaleCra(this.idCra, this.indexWeek);
  }

  getColor() {
    return this.color;
  }

  setDureeToOne() {
    const duree = this.craService.getDureeTotaleCra(this.idCra, this.indexWeek);
    this.dureeString = (1 - duree).toPrecision(1).toString();
    this.onModifyCase();
  }
}
