import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';
import { ServiceType } from 'src/app/interfaces';

@Component({
  selector: 'app-serviceAdd',
  templateUrl: './service.add.component.html',
  styleUrls: ['./service.add.component.css']
})
export class ServiceAddComponent {

  constructor(public dialogRef: MatDialogRef<ServiceAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: TransportService, private snackBar: MatSnackBar) { }

  formControl = new FormControl('', [
    Validators.required
  ]);
  serviceTypes: ServiceType[] = [];

  ngOnInit() {
    console.log(this.data);
    this.service.getServiceType("service-type").subscribe(serviceType => {this.serviceTypes = <ServiceType[]>serviceType.body.records;});
  }

  public confirmAdd(): void {
    if (this.data.code > 0) {
      this.service.putService("service", this.data).subscribe(service => {
        if (service.error) {
          this.snackBar.open("No se pudo actualizar el servicio.", "Error", {
            duration: 3000,
          });
          console.log(service.body);
        }
        else {
          console.log(service.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postService("service", this.data).subscribe(service => {
        if (service.error) {
          this.snackBar.open("No se pudo crear el servicio.", "Error", {
            duration: 3000,
          });
          console.log(service.body);
        }
        else {
          console.log(service.body);
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