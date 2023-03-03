import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-activityStateAdd',
  templateUrl: './activity.state.add.component.html',
  styleUrls: ['./activity.state.add.component.css']
})
export class ActivityStateAddComponent {

  constructor(public dialogRef: MatDialogRef<ActivityStateAddComponent>,
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
      this.service.putActivityState("activity-state", this.data).subscribe(activityState => {
        if (activityState.error) {
          this.snackBar.open("No se pudo actualizar el estado de actividad.", "Error", {
            duration: 3000,
          });
          console.log(activityState.body);
        }
        else {
          console.log(activityState.body);
          this.dialogRef.close(1);
        }
      });
    }
    else {
      this.service.postActivityState("activity-state", this.data).subscribe(activityState => {
        if (activityState.error) {
          this.snackBar.open("No se pudo crear el estado de actividad.", "Error", {
            duration: 3000,
          });
          console.log(activityState.body);
        }
        else {
          console.log(activityState.body);
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