import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { FormControl, Validators } from '@angular/forms';
import { Session, Provider, Activity } from 'src/app/interfaces';

@Component({
  selector: 'app-activityAssign',
  templateUrl: './activity.assign.component.html',
  styleUrls: ['./activity.assign.component.css']
})
export class ActivityAssignComponent {

  constructor(public dialogRef: MatDialogRef<ActivityAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: TransportService, private snackBar: MatSnackBar) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  userTransport: Session = {alias: '', name: '', providerCode: 0, userRoleCode: 0, contactPhoneNumber: ''};
  userTransfer: Session = {alias: '', name: '', providerCode: 0, userRoleCode: 0, contactPhoneNumber: ''};
  providerTransport: Provider = {code: 2, name: ''};
  providerTransfer: Provider = {code: 2, name: ''};
  subActivity: Activity[] = [];
  users: Session[] = [];
  usersFiltered1: Session[] = [];
  usersFiltered2: Session[] = [];
  providers: Provider[] = []

  ngOnInit() {
    console.log(this.data);
    this.getOtherTables();
    if (this.data.hasChildActivity == 1) {
      this.service.getCustomActivity("activity", "/0/0/0/0/0/0/0/0/" + 
      "1/" + this.data.code + "/" +
      "1/" + this.data.customerCode + "/" +
      "1/" + this.data.serviceCode + "/" +
      "1/" + this.data.serviceServiceTypeCode + "/" +
      "0/0/0/0/0/a/0/0/0/0/0/0/0/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/1/100").subscribe(activity => {
        this.subActivity = <Activity[]>activity.body.records;
      });
    }
  }

  getOtherTables() {
    this.service.getProvider("provider").subscribe(provider => {
      this.providers = <Provider[]>provider.body.records;
      this.filterProvider(2, 1);
      this.filterProvider(2, 2);
    });
    //console.log("/" + this.data.code + "/" + this.data.customerCode + "/" + this.data.serviceCode + "/" + this.data.serviceServiceTypeCode + "/");
    this.service.getCustomUser("user", "/" + this.data.code + 
    "/" + this.data.customerCode +
    "/" + this.data.serviceCode +
    "/" + this.data.serviceServiceTypeCode + "/").subscribe(user => {
      this.users = <Session[]>user.body.records;
      //console.log(user.body.records);
    });
  }

  assign() {
    if (this.data.hasChildActivity == 1) {
      (<Activity>this.subActivity[0]).userProviderCode = this.providerTransfer.code;
      (<Activity>this.subActivity[0]).userAlias = this.userTransfer.alias;
      this.service.putActivityAssign("activity", this.subActivity[0]).subscribe(subActivity => {
        if (subActivity.error) {
          this.snackBar.open("No se pudo asignar transfer", "Error", {
            duration: 3000,
          });
          console.log(subActivity.body);
        }
        else {
          this.data.userProviderCode = this.providerTransport.code;
          this.data.userAlias = this.userTransport.alias;
          this.service.putActivityAssign("activity", this.data).subscribe(activity => {
            if (activity.error) {
              this.snackBar.open("No se pudo asignar transportista", "Error", {
                duration: 3000,
              });
              console.log(activity.body);
            }
            else {
              this.onNoClick(1);
            }
          });
        }
      });
    }
    else {
      this.data.userProviderCode = this.providerTransport.code;
      this.data.userAlias = this.userTransport.alias;
      if (this.data.activityCode) {
        this.service.putActivityAssign("activity", this.data).subscribe(subActivity => {
          if (subActivity.error) {
            this.snackBar.open("No se pudo asignar transfer", "Error", {
              duration: 3000,
            });
            console.log(subActivity.body);
          }
          else {
            this.onNoClick(1);
          }
        });
      }
      else {
        this.service.putActivityAssign("activity", this.data).subscribe(activity => {
          if (activity.error) {
            this.snackBar.open("No se pudo asignar transportista", "Error", {
              duration: 3000,
            });
            console.log(activity.body);
          }
          else {
            this.onNoClick(1);
          }
        });
      }
    }
  }

  filterProvider(providerCode, n) {
    if (n == 1) {
      this.usersFiltered1 = [];
      for (let user of this.users) {
        if (user.providerCode == providerCode) {
          this.usersFiltered1.push(user);
          //this.data.locationCode = location.locationTypeCode;
        }
      }
    }
    else {
      this.usersFiltered2 = [];
      for (let user of this.users) {
        if (user.providerCode == providerCode) {
          this.usersFiltered2.push(user);
          //this.data.locationCode = location.locationTypeCode;
        }
      }
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' : '';
  }

  onNoClick(n): void {
    this.dialogRef.close(n);
  }
}