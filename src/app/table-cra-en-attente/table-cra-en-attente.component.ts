import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {CraWeekInsert} from '../models/craWeekInsert';
import {TableCraAdministration} from '../administration-cra/TableCraAdministraton';
import {HttpClient} from '@angular/common/http';
import {CraService} from '../../services/cra.service';
import {CraHttpDatabase} from '../configuration/CraHttpDatabase';
import {CraWeek} from '../models/craWeek';
import {InsertCra} from '../models/InsertCra';
import {CompteRendu} from '../models/CompteRendu';
import {Cra} from '../models/Cra';
import {Subscription} from 'rxjs';
import {CraWaitingService} from '../../services/craWaiting.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-table-cra-en-attente',
  templateUrl: './table-cra-en-attente.component.html',
  styleUrls: ['./table-cra-en-attente.component.scss']
})

export class TableCraEnAttenteComponent implements OnInit, AfterViewInit {
  @Input() index!: string;
  // @Input() index!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CraWeekInsert>;
  dataSource: TableCraAdministration;
  listeCraWaiting: CraWeekInsert[] = [];
  listeCraValidate: CraWeekInsert[] = [];
  actualWeek!: CraWeek ;
  listeCraSubscription!:Subscription;
  commentaire = '';
  headTableElements = ['dateStart', 'dateEnd', 'Nom', 'Prenom', 'actions'];

  ngAfterViewInit(): void {
    console.log("oooo"+this.index);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  constructor(private httpClient: HttpClient, private craService: CraService, public craWaitingService: CraWaitingService, public dialog: MatDialog) {
    this.dataSource = new TableCraAdministration(this.httpClient);
  }

  ngOnInit(): void {
      this.listeCraSubscription = this.craWaitingService.waitingSubject.subscribe(
        (craWeek: CraWeekInsert[]) => {this.listeCraWaiting = craWeek;this.update();

        });
      this.listeCraSubscription = this.craWaitingService.validateSubject.subscribe(
        (craWeek: CraWeekInsert[]) => {this.listeCraValidate = craWeek;this.update();
        });
  }

  openDialog(cra: CraWeekInsert): void {
    const dialogRef = this.dialog.open(DialogContent, {
      width: '550px',
      data: {name: this.commentaire}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.commentaire = result;
      console.log("Dialog result:", this.commentaire);
      this.refuserCra(cra);
    });

  }

  update(){
    if(this.index=='1')
      this.dataSource.setListe(this.listeCraWaiting);
    else if(this.index=='2')
      this.dataSource.setListe(this.listeCraValidate);
  }
  consulter(cra : CraWeekInsert ){
    console.log("ttt ", cra);
      //this.craService.initialisation(new Date(cra.dateStart), true);
      this.actualWeek = new CraWeek(0, new Date(cra.dateStart));
      let status = cra.status;

      const craHttp = new CraHttpDatabase(this.httpClient);
      const response = craHttp.getCra(cra.dateStart, cra.dateEnd, '10');
      response.subscribe(reponse => {
        if(reponse.status == 'OK'){
          console.log(reponse);
          this.transform(reponse.liste_cra);
        }
        else{
          console.log("Erreur de requete de base de données");
        }

      });

  }
  public transform(liste_cra: InsertCra[]): void {
    console.log("je suis ici ahahhahahhahahaha");
    // tslint:disable-next-line:no-non-null-assertion
    this.actualWeek.listeCra = [];
    for (const cra of liste_cra) {

      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.statusConge;
      const listCr = [];
      if (cra.listeCr != null){
        for (const sp of cra.listeCr){
          listCr.push(new CompteRendu(id, sp.id_commande, +sp.duree, sp.color));
        }
      }
      this.actualWeek!.listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
    }
  }
  validerCra(cra: CraWeekInsert){
    console.log("iciiiiiiii i i i i ",cra);
   this.craWaitingService.validerCra(cra, 'OK');
  }
  refuserCra(cra: CraWeekInsert){
    this.craWaitingService.refuserCra(cra, this.commentaire);
      this.paginator!._changePageSize(this.paginator!.pageSize);


  }

}

export interface DialogData {
  commentaire: string;
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  // onClickSend(): void {
  //   this.dialogRef.close();
  // }

}
