import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {CraWeekInsert} from '../models/craWeekInsert';
import {TableCraAdministration} from '../administration-cra/TableCraAdministraton';
import {HttpClient} from '@angular/common/http';
import {CraService} from '../../services/cra.service';

@Component({
  selector: 'app-table-cra-en-attente',
  templateUrl: './table-cra-en-attente.component.html',
  styleUrls: ['./table-cra-en-attente.component.scss']
})
export class TableCraEnAttenteComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CraWeekInsert>;
  dataSource: TableCraAdministration;

  headTableElements = ['dateStart', 'dateEnd', 'Nom', 'Prenom', 'actions'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  constructor(private httpClient: HttpClient, private craService: CraService) {
    this.dataSource = new TableCraAdministration(httpClient);


    // this.listeCraValidate = this.sortList(this.listeCraValidate);
  }
  ngOnInit(): void {
  }

}
