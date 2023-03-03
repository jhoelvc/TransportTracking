import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';
import { UserRole, Provider } from 'src/app/interfaces';

@Component({
  selector: 'app-userAdd',
  templateUrl: './user.add.component.html',
  styleUrls: ['./user.add.component.css']
})
export class UserAddComponent {

  constructor(public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: TransportService, private snackBar: MatSnackBar) { }

  formControl = new FormControl('', [
    Validators.required
  ]);
  provider: Provider = {code: 1, name: ''};
  userRole: UserRole = {code: 1, name: ''};
  providers: Provider[] = [];
  roles: UserRole[] = [];
  position: string;
  hide = true;

  ngOnInit() {
    this.getOtherTables();
    console.log(this.data);
  }

  getOtherTables() {
    this.service.getProvider("provider").subscribe(provider => this.providers = <Provider[]>provider.body.records);
    this.service.getUserRole("user-role").subscribe(userRole => this.roles = <UserRole[]>userRole.body.records);
  }

  public confirmAdd(): void {
    if (this.data.providerCode > 0) {
      //this.userRole.code == 4 ? this.data.alias = this.data.alias + "_" + this.position :  null;
      //this.data.providerCode = this.provider.code;
      //this.data.userRoleCode = this.userRole.code;
      this.service.putUser("user", this.data).subscribe(user => {
        if (user.error) {
          this.snackBar.open("No se pudo actualizar el usuario.", "Error", {
            duration: 3000,
          });
          console.log(user.body);
        }
        else {
          console.log(user.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.userRole.code == 4 ? this.data.alias = this.data.alias + "_" + this.position :  null;
      this.data.providerCode = this.provider.code;
      this.data.userRoleCode = this.userRole.code;
      this.service.postUser("user", this.data).subscribe(user => {
        if (user.error) {
          this.snackBar.open("No se pudo crear el usuario.", "Error", {
            duration: 3000,
          });
          console.log(user.body);
        }
        else {
          console.log(user.body);
          this.dialogRef.close(1);
        }
      });
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' : '';
  }

  onNoClick(): void {
    this.dialogRef.close(-1);
  }
}