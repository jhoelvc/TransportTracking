import { Component } from '@angular/core';
import { TransportService } from '../services/transport.service';
import { Credential, Provider } from '../interfaces'
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-z0-9_-]{3,24}$/)
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-z0-9-]{3,18}$/)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private service: TransportService) { }

  error = false;
  username: string;
  password: string;
  provider: Provider = {code: 1, name: ""};
  providers: object[] = [];
  credential: Credential;
  isLoading = false;

  getErrorMessage(i: number) {
    if (i == 1)
      return this.userFormControl.hasError('required') ? 'Usuario es requerido' : 'Por favor ingrese un usuario valido';
    else
      return this.passwordFormControl.hasError('required') ? 'Contraseña es requerida' : 'Por favor ingrese una contraseña valida';
  }

  ngOnInit() { 
    this.service.getProviderAnonymous("provider").subscribe(provider => {
      this.providers = provider.body.records;
    });
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  login() {
    this.error = false;
    this.isLoading = true;
    this.credential = {
      alias: this.username, 
      password: this.password,
      name: "",
      contactPhoneNumber: "",
      providerCode : this.provider.code,
      userRoleCode : 0
    }

    return this.service.loginUser(this.credential).subscribe(data => {
        console.log(data);
        if (data.error){
          this.error = data.error;
          this.isLoading = false;
        } 
        else {
          this.error = data.error;
          this.isLoading = false;
          this.setToken(data.body);
          //this.authService.getStatus();
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }
      }
    );
  }
}