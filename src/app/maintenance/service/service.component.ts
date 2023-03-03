import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { Service, ServiceType } from 'src/app/interfaces';
import { ServiceAddComponent } from 'src/app/dialogs/service/service.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  serviceTypes: ServiceType[] = [];
  serv: Service = {code: 0, serviceTypeCode: 1, name: ''};
  displayedColumns: string[] = ['code', 'serviceTypeCode', 'name', 'actionsColumn'];
  pageEvent: PageEvent;
  string: string = "/0/0/0/0/0/a/";
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  isLoading = true;

  ngOnInit() {
    this.getTable();
    this.getOtherTable();
  }

  getTable() {
    this.service.getCustomService("service", this.string + this.pageIndex + "/" + this.pageSize).subscribe(service => {
      this.isLoading = false;
      this.dataSource.data = service.body.records;
      this.recordsFound = service.body.recordsFound;
    }, error => this.isLoading = false);
  }

  getOtherTable() {
    this.service.getServiceType("service-type").subscribe(serviceType => {this.serviceTypes = <ServiceType[]>serviceType.body.records;});
  }

  addNew() {
    const dialogRef = this.dialog.open(ServiceAddComponent, {
      data: {code: 0, serviceTypeCode: 1, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(service) {
    const dialogRef = this.dialog.open(ServiceAddComponent, {
      data: service
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(service) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Servicio', address: service.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteService("service", service).subscribe(service => {
          if (service.error) {
            this.snackBar.open("No se pudo eliminar el servicio", "Error", {
              duration: 4000,
            });
            console.log(service.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el servicio con exito", "Hecho", {
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
    this.service.getCustomService("service", this.string + this.pageIndex + "/" + this.pageSize).subscribe(service => {
      this.isLoading = false;
      this.dataSource.data = service.body.records;
      this.recordsFound = service.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}