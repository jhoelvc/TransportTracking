import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { LocationType } from 'src/app/interfaces';
import { LocationTypeAddComponent } from 'src/app/dialogs/location-type/location.type.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-locationType',
  templateUrl: './location.type.component.html',
  styleUrls: ['./location.type.component.css']
})
export class LocationTypeComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  locationType: LocationType = {code: 0, name: ''};
  displayedColumns: string[] = ['code', 'name', 'actionsColumn'];
  pageEvent: PageEvent;
  string: string = "/0/0/0/a/";
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  isLoading = true;

  ngOnInit() {
    this.getTable();
  }

  getTable() {
    this.service.getCustomLocationType("location-type", this.string + this.pageIndex + "/" + this.pageSize).subscribe(locationType => {
      this.isLoading = false;
      this.dataSource.data = locationType.body.records;
      this.recordsFound = locationType.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(LocationTypeAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(locationType) {
    const dialogRef = this.dialog.open(LocationTypeAddComponent, {
      data: locationType
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(locationType) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Tipo de Ubicacion', address: locationType.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteLocationType("location-type", locationType).subscribe(locationType => {
          if (locationType.error) {
            this.snackBar.open("No se pudo eliminar el tipo de ubicacion", "Error", {
              duration: 4000,
            });
            console.log(locationType.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el tipo de ubicacion con exito", "Hecho", {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      }
    });
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    this.service.getCustomLocationType("location-type", this.string + this.pageIndex + "/" + this.pageSize).subscribe(locationType => {
      this.isLoading = false;
      this.dataSource.data = locationType.body.records;
      this.recordsFound = locationType.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}