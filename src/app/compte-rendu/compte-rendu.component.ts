import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
  color!: string ;
  @Input()
  index!: number;
  @Input()
  idCra!: number;
  isInsideComponent = false;
 // @HostListener('click')
 // clickInside() {
 //   this.isInsideComponent = true;
 // }

  //@HostListener('document:click')
  //clickout() {
   // if (!this.isInsideComponent) {
    //  this.onModifyCase();
     // console.log(this.craService.listeCr);
   // }
   // this.isInsideComponent = false;
 // }

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

  supprimer(){
    this.onModifyCase();
  }
  ngOnInit(): void {
  }

  onModifyCase(){
   this.craService.editCraDuree(this.idCra, this.duree, this.index);
  }

  getColor(){
    return this.color;
  }

}
