import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { Customer } from 'src/app/interfaces';
import { CustomerAddComponent } from 'src/app/dialogs/customer/customer.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  customer: Customer = {code: 0, documentCode: '', name: ''};
  displayedColumns: string[] = ['code', 'documentCode', 'name', 'actionsColumn'];
  pageEvent: PageEvent;
  string: string = "/0/0/0/a/0/a/";
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  isLoading = true;

  ngOnInit() {
    this.getTable();
  }

  getTable() {
    this.service.getCustomCustomer("customer", this.string + this.pageIndex + "/" + this.pageSize).subscribe(customer => {
      this.isLoading = false;
      this.dataSource.data = customer.body.records;
      this.recordsFound = customer.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(CustomerAddComponent, {
      data: {code: 0, documentCode: '', name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(customer) {
    const dialogRef = this.dialog.open(CustomerAddComponent, {
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(customer) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Agencia', address: customer.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteCustomer("customer", customer).subscribe(customer => {
          if (customer.error) {
            this.snackBar.open("No se pudo eliminar la agencia", "Error", {
              duration: 4000,
            });
            console.log(customer.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el agencia con exito", "Hecho", {
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
    this.service.getCustomCustomer("customer", this.string + this.pageIndex + "/" + this.pageSize).subscribe(customer => {
      this.isLoading = false;
      this.dataSource.data = customer.body.records;
      this.recordsFound = customer.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}