import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { CancellationReason } from 'src/app/interfaces';
import { CancellationReasonAddComponent } from 'src/app/dialogs/cancellation-reason/cancellation.reason.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-cancellationReason',
  templateUrl: './cancellation.reason.component.html',
  styleUrls: ['./cancellation.reason.component.css']
})
export class CancellationReasonComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  cancellationReason: CancellationReason = {code: 0, name: ''};
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
    this.service.getCustomCancellationReason("cancellation-reason", this.string + this.pageIndex + "/" + this.pageSize).subscribe(cancellationReason => {
      this.isLoading = false;
      this.dataSource.data = cancellationReason.body.records;
      this.recordsFound = cancellationReason.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(CancellationReasonAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(cancellationReason) {
    const dialogRef = this.dialog.open(CancellationReasonAddComponent, {
      data: cancellationReason
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(cancellationReason) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Razon de cancelacion', address: cancellationReason.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteCancellationReason("cancellation-reason", cancellationReason).subscribe(cancellationReason => {
          if (cancellationReason.error) {
            this.snackBar.open("No se pudo eliminar la razon de cancelacion", "Error", {
              duration: 4000,
            });
            console.log(cancellationReason.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino la razon de cancelacion con exito", "Hecho", {
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
    this.service.getCustomCancellationReason("cancellation-reason", this.string + this.pageIndex + "/" + this.pageSize).subscribe(cancellationReason => {
      this.isLoading = false;
      this.dataSource.data = cancellationReason.body.records;
      this.recordsFound = cancellationReason.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}