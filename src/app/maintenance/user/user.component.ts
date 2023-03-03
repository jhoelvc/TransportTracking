import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { UserRole, Provider, User } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { UserAddComponent } from 'src/app/dialogs/user/user.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  roleCtrl = new FormControl({value: '', disabled: true});
  providerCtrl = new FormControl({value: '', disabled: true});
  filteredProvider: Observable<object[]>;

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  user: User = {alias: '', name: '', contactPhoneNumber: '', providerCode: 0, userRoleCode: 0, hash: '', salt: ''};
  role: UserRole = {code: 0, name: ''};
  providers: Provider[] = [];
  roles: UserRole[] = [];
  displayedColumns: string[] = ['alias', 'name', 'providerCode', 'userRoleCode', 'contactPhoneNumber', 'actionsColumn'];
  pageEvent: PageEvent;
  filter: any = {};
  string: string = "/0/a/0/0/0/0/0/0/0/a/";
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  isLoading = true;

  ngOnInit() {
    this.getTable();
    this.getOtherTables();

    this.filteredProvider = this.providerCtrl.valueChanges
    .pipe(
      startWith(''),
      map(provider => provider ? this._filterProviders(provider) : this.providers.slice())
    );
  }

  getTable() {
    this.service.getCustomUser("user", this.string + this.pageIndex + "/" + this.pageSize).subscribe(user => {
      this.isLoading = false;
      this.dataSource.data = user.body.records;
      this.recordsFound = user.body.recordsFound;
    }, error => this.isLoading = false);
  }

  getOtherTables() {
    this.service.getProvider("provider").subscribe(provider => this.providers = <Provider[]>provider.body.records);
    this.service.getUserRole("user-role").subscribe(userRole => this.roles = <UserRole[]>userRole.body.records);
  }

  addNew() {
    const dialogRef = this.dialog.open(UserAddComponent, {
      data: {alias: '', name: '', contactPhoneNumber: '', providerCode: 0, userRoleCode: 0, hash: '', salt: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(user) {
    const dialogRef = this.dialog.open(UserAddComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(user) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Usuario', address: user.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteUser("user", user).subscribe(user => {
          if (user.error) {
            this.snackBar.open("No se pudo eliminar el usuario", "Error", {
              duration: 4000,
            });
            console.log(user.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el usuario con exito", "Hecho", {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      }
    });
  }

  select(event, element, n) {
    if (event.source.selected) {
      if (n == 1) {
        this.filter.provider = element.code;
      }
      else if (n == 2) {
        this.filter.userRole = event.value;
      }
    }
  }

  findUser() {
    this.isLoading = true;
    this.dataSource.data = [];
    this.string = '/0/a/' +
    (!this.providerCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.provider ? this.filter.provider : 0).toString() + '/' + 
    (!this.roleCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.userRole ? this.filter.userRole : 0).toString() + '/' + 
    '0/a/' + '0/a/';
    console.log(this.string);
    this.service.getCustomUser("user", this.string + this.pageIndex + '/' + this.pageSize).subscribe(data => {
      this.isLoading = false;
      this.dataSource.data = data.body.records;
      this.recordsFound = data.body.recordsFound;
    }, error => this.isLoading = false);
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    this.service.getCustomUser("user", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activity => {
      this.isLoading = false;
      this.dataSource.data = activity.body.records;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  private _filterProviders(value: string): object[] {
    const filterValue = value.toLowerCase();
    //let array = this.providers.filter(provider => (<Provider>provider).name.toLowerCase().includes(filterValue));
    return this.providers.filter(provider => (<Provider>provider).name.toLowerCase().includes(filterValue));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}