import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancellationReasonAdd',
  templateUrl: './cancellation.reason.add.component.html',
  styleUrls: ['./cancellation.reason.add.component.css']
})
export class CancellationReasonAddComponent {

  constructor(public dialogRef: MatDialogRef<CancellationReasonAddComponent>,
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
      this.service.putCancellationReason("cancellation-reason", this.data).subscribe(cancellationReason => {
        if (cancellationReason.error) {
          this.snackBar.open("No se pudo actualizar la razon de cancelacion.", "Error", {
            duration: 3000,
          });
          console.log(cancellationReason.body);
        }
        else {
          console.log(cancellationReason.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postCancellationReason("cancellation-reason", this.data).subscribe(cancellationReason => {
        if (cancellationReason.error) {
          this.snackBar.open("No se pudo crear la razon de cancelacion.", "Error", {
            duration: 3000,
          });
          console.log(cancellationReason.body);
        }
        else {
          console.log(cancellationReason.body);
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