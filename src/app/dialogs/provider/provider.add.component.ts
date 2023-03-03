import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-providerAdd',
  templateUrl: './provider.add.component.html',
  styleUrls: ['./provider.add.component.css']
})
export class ProviderAddComponent {

  constructor(public dialogRef: MatDialogRef<ProviderAddComponent>,
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
      this.service.putProvider("provider", this.data).subscribe(provider => {
        console.log(provider);
        if (provider.error) {
          this.snackBar.open("No se pudo modificar el proveedor.", "Error", {
            duration: 3000,
          });
          console.log(provider.body);
        }
        else {
          console.log(provider.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postProvider("provider", this.data).subscribe(provider => {
        console.log(provider);
        if (provider.error) {
          this.snackBar.open("No se pudo crear el proveedor.", "Error", {
            duration: 3000,
          });
          console.log(provider.body);
        }
        else {
          console.log(provider.body);
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