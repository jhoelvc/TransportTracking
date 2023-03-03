import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { TransportService } from 'src/app/services/transport.service';
import { Credential } from '../../interfaces';
import { MyErrorStateMatcher } from 'src/app/login/login.component';
import * as jwt_decode from 'jwt-decode';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css'],
})
export class ChangePasswordComponent {
  form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.pattern(/^[A-z0-9-]{3,18}$/)]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(/^[A-z0-9-]{3,18}$/)]),
      verifyPassword: new FormControl('', [Validators.required, Validators.pattern(/^[A-z0-9-]{3,18}$/)])
    },
    this.passwordValidator
  );
  matcher = new MyErrorStateMatcher();
  errorMatcher = new CrossFieldErrorMatcher();
  
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: TransportService) {}
  
  hide1 = true;
  hide2 = true;
  hide3 = true;
  pass = false;
  password1 = "";
  password2 = "";
  password3 = "";
  credential: Credential = {
    alias: "", 
    password: "",
    name: "",
    contactPhoneNumber: "",
    providerCode : 0,
    userRoleCode : 0
  };

  ngOnInit() {
    var token = localStorage.getItem('accessToken');
    var decoded = jwt_decode(token);
    this.credential = decoded.auth;
  }

  change() {
    if (this.password2 != this.password3) {
      console.log("Las contraseñas no coinciden");
    }
    else {
      this.credential.password = this.password1 + "," + this.password2;
      this.service.putUserPassword(this.credential).subscribe(data => {
        if (data.error) {
          this.password1 = '';
          this.pass = true;
        }
        else {
          this.dialogRef.close(1);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(-1);
  }

  getErrorMessage(controlName: string) {
    if (this.form.controls[controlName].hasError('pattern')) {
      return 'Por favor ingrese una contraseña valida';
    }
    if (this.form.controls[controlName].hasError('required')) {
      return 'Contraseña actual requerida';
    }
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('newPassword').value !== form.get('verifyPassword').value;
    return condition ? {passwordsDoNotMatch: true} : null;
  }
}