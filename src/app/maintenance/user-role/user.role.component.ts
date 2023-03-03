import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { UserRole } from 'src/app/interfaces';
import { UserRoleAddComponent } from 'src/app/dialogs/user-role/user.role.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-userRole',
  templateUrl: './user.role.component.html',
  styleUrls: ['./user.role.component.css']
})
export class UserRoleComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  userRole: UserRole = {code: 0, name: ''};
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
    this.service.getCustomUserRole("user-role", this.string + this.pageIndex + "/" + this.pageSize).subscribe(userRole => {
      this.isLoading = false;
      this.dataSource.data = userRole.body.records;
      this.recordsFound = userRole.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(UserRoleAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(userRole) {
    const dialogRef = this.dialog.open(UserRoleAddComponent, {
      data: userRole
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(userRole) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Rol de Usuario', address: userRole.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteUserRole("user-role", userRole).subscribe(userRole => {
          if (userRole.error) {
            this.snackBar.open("No se pudo eliminar el rol de usuario", "Error", {
              duration: 4000,
            });
            console.log(userRole.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el rol de usuario con exito", "Hecho", {
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
    this.service.getCustomUserRole("user-role", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activity => {
      this.isLoading = false;
      this.dataSource.data = activity.body.records;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}