import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-locationTypeAdd',
  templateUrl: './location.type.add.component.html',
  styleUrls: ['./location.type.add.component.css']
})
export class LocationTypeAddComponent {

  constructor(public dialogRef: MatDialogRef<LocationTypeAddComponent>,
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
      this.service.putLocationType("location-type", this.data).subscribe(locationType => {
        if (locationType.error) {
          this.snackBar.open("No se pudo actualizar el tipo de servicio.", "Error", {
            duration: 3000,
          });
          console.log(locationType.body);
        }
        else {
          console.log(locationType.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postLocationType("location-type", this.data).subscribe(locationType => {
        if (locationType.error) {
          this.snackBar.open("No se pudo crear el tipo de servicio.", "Error", {
            duration: 3000,
          });
          console.log(locationType.body);
        }
        else {
          console.log(locationType.body);
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