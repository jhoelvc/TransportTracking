import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { Provider } from 'src/app/interfaces';
import { ProviderAddComponent } from 'src/app/dialogs/provider/provider.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  provider: Provider = {code: 0, name: ''};
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
    this.service.getCustomProvider("provider", this.string + this.pageIndex + "/" + this.pageSize).subscribe(provider => {
      this.isLoading = false;
      this.dataSource.data = provider.body.records;
      this.recordsFound = provider.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(ProviderAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(provider) {
    const dialogRef = this.dialog.open(ProviderAddComponent, {
      data: provider
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(provider) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Proveedor', address: provider.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteProvider("provider", provider).subscribe(provider => {
          if (provider.error) {
            this.snackBar.open("No se pudo eliminar el proveedor", "Error", {
              duration: 4000,
            });
            console.log(provider.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el Proveedor con exito", "Hecho", {
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
    this.service.getCustomProvider("provider", this.string + this.pageIndex + "/" + this.pageSize).subscribe(provider => {
      this.isLoading = false;
      this.dataSource.data = provider.body.records;
      this.recordsFound = provider.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}