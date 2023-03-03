import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { ServiceType } from 'src/app/interfaces';
import { ServiceTypeAddComponent } from 'src/app/dialogs/service-type/service.type.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-serviceType',
  templateUrl: './service.type.component.html',
  styleUrls: ['./service.type.component.css']
})
export class ServiceTypeComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  serviceType: ServiceType = {code: 0, name: ''};
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
    this.service.getCustomServiceType("service-type", this.string + this.pageIndex + "/" + this.pageSize).subscribe(serviceType => {
      this.isLoading = false;
      this.dataSource.data = serviceType.body.records;
      this.recordsFound = serviceType.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(ServiceTypeAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(serviceType) {
    const dialogRef = this.dialog.open(ServiceTypeAddComponent, {
      data: serviceType
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(serviceType) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Tipo de Servicio', address: serviceType.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteServiceType("service-type", serviceType).subscribe(serviceType => {
          if (serviceType.error) {
            this.snackBar.open("No se pudo eliminar el tipo de servicio", "Error", {
              duration: 4000,
            });
            console.log(serviceType.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el tipo de servicio con exito", "Hecho", {
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
    this.service.getCustomServiceType("service-type", this.string + this.pageIndex + "/" + this.pageSize).subscribe(serviceType => {
      this.isLoading = false;
      this.dataSource.data = serviceType.body.records;
      this.recordsFound = serviceType.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}