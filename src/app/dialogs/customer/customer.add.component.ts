import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-customerAdd',
  templateUrl: './customer.add.component.html',
  styleUrls: ['./customer.add.component.css']
})
export class CustomerAddComponent {

  constructor(public dialogRef: MatDialogRef<CustomerAddComponent>,
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
      this.service.putCustomer("customer", this.data).subscribe(customer => {
        if (customer.error) {
          this.snackBar.open("No se pudo actualizar la agencia.", "Error", {
            duration: 3000,
          });
          console.log(customer.body);
        }
        else {
          console.log(customer.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postCustomer("customer", this.data).subscribe(customer => {
        if (customer.error) {
          this.snackBar.open("No se pudo crear la agencia.", "Error", {
            duration: 3000,
          });
          console.log(customer.body);
        }
        else {
          console.log(customer.body);
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