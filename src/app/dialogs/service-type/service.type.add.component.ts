import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-serviceTypeAdd',
  templateUrl: './service.type.add.component.html',
  styleUrls: ['./service.type.add.component.css']
})
export class ServiceTypeAddComponent {

  constructor(public dialogRef: MatDialogRef<ServiceTypeAddComponent>,
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
      this.service.putServiceType("service-type", this.data).subscribe(serviceType => {
        if (serviceType.error) {
          this.snackBar.open("No se pudo actualizar el tipo de servicio.", "Error", {
            duration: 3000,
          });
          console.log(serviceType.body);
        }
        else {
          console.log(serviceType.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postServiceType("service-type", this.data).subscribe(serviceType => {
        if (serviceType.error) {
          this.snackBar.open("No se pudo crear el tipo de servicio.", "Error", {
            duration: 3000,
          });
          console.log(serviceType.body);
        }
        else {
          console.log(serviceType.body);
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