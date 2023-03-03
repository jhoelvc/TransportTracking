import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-userRoleAdd',
  templateUrl: './user.role.add.component.html',
  styleUrls: ['./user.role.add.component.css']
})
export class UserRoleAddComponent {

  constructor(public dialogRef: MatDialogRef<UserRoleAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: TransportService, private snackBar: MatSnackBar) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  ngOnInit() {
    console.log(this.data);
  }

  public confirmAdd(): void {
    if (this.data.code > 0) {
      this.service.putUserRole("user-role", this.data).subscribe(userRole => {
        if (userRole.error) {
          this.snackBar.open("No se pudo actualizar el rol de usuario.", "Error", {
            duration: 3000,
          });
          console.log(userRole.body);
        }
        else {
          console.log(userRole.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postUserRole("user-role", this.data).subscribe(userRole => {
        if (userRole.error) {
          this.snackBar.open("No se pudo crear el rol de usuario.", "Error", {
            duration: 3000,
          });
          console.log(userRole.body);
        }
        else {
          console.log(userRole.body);
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