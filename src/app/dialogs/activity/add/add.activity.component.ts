import { Component, Inject, EventEmitter } from '@angular/core';
import { TransportService } from '../../../services/transport.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatBottomSheet } from '@angular/material';
import { Customer, ServiceType, Service, ActivityState, Activity, User, Provider, Location, LocationType, RouteProfile } from 'src/app/interfaces';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-addactivity',
  templateUrl: './add.activity.component.html',
  styleUrls: ['./add.activity.component.css']
})
export class AddActivityComponent {

  routeCtrl = new FormControl({value: '', disabled: false});
  filteredRoute: Observable<object[]>;

  constructor(public dialogRef: MatDialogRef<AddActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: TransportService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet) { }
  
  activity: Activity = {code : 0,
    customerCode: 0,
    serviceCode: 0,
    serviceServiceTypeCode: 0,
    activityStateCode: 0,
    routeProfileCode: 0,
    userAlias: '',
    userProviderCode: 0,
    activityCode: 0,
    activityCustomerCode: 0,
    activityServiceCode: 0,
    activityServiceServiceTypeCode: 0,
    cancellationReasonCode: 0,
    locationCode: 0,
    locationLocationTypeCode: 0,
    scheduledDate: 0,
    passengerName: 0,
    passengersNumber: 0,
    remark : '',
    checkIn: 0,
    checkOut: 0,
    hasChildActivity: 0
  }

  subActivity: Activity = {code : 0,
    customerCode: 0,
    serviceCode: 0,
    serviceServiceTypeCode: 0,
    activityStateCode: 0,
    routeProfileCode: 0,
    userAlias: '',
    userProviderCode: 0,
    activityCode: 0,
    activityCustomerCode: 0,
    activityServiceCode: 0,
    activityServiceServiceTypeCode: 0,
    cancellationReasonCode: 0,
    locationCode: 0,
    locationLocationTypeCode: 0,
    scheduledDate: 0,
    passengerName: 0,
    passengersNumber: 0,
    remark : '',
    checkIn: 0,
    checkOut: 0,
    hasChildActivity: 0
  }
  customers: Customer[] = [];
  serviceTypes: ServiceType[] = [];
  services: Service[] = [];
  locationTypes: LocationType[] = [];
  locations: Location[] = [];
  activityStates: ActivityState[] = [];
  providers: Provider[] = [];
  users: User[] = [];
  locationFiltered: Location[] = [];
  routeProfiles: RouteProfile[] = [];
  onAdd = new EventEmitter();
  transfer = false;
  minDate = new Date();

  ngOnInit() {
    this.getOtherTables();
    
    if (this.data.activity) {
      console.log(this.data.activity);
      this.data.scheduledDate = new Date();
      this.data.serviceServiceTypeCode = this.data.activity.serviceServiceTypeCode;
      this.data.serviceCode = this.data.activity.serviceCode;
      this.data.customerCode = this.data.activity.customerCode;
      this.data.passengersNumber = this.data.activity.passengersNumber;
      this.data.userProviderCode = this.data.activity.userProviderCode;
      this.data.locationLocationTypeCode = this.data.activity.locationLocationTypeCode;
      this.data.locationCode = this.data.activity.locationCode;
      this.data.passengerName = this.data.activity.passengerName;
      this.data.remark = this.data.activity.remark;
      this.data.routeProfileCode = this.data.activity.routeProfileCode;
      this.data.scheduledDate = new Date(this.data.activity.scheduledDate * 1000);
      this.data.hour = (new Date(this.data.scheduledDate).getHours() < 10 ? '0' + new Date(this.data.scheduledDate).getHours().toString() : new Date(this.data.scheduledDate).getHours().toString()) + ':' 
      + ((new Date(this.data.scheduledDate).getMinutes() < 10) ? '0' + new Date(this.data.scheduledDate).getMinutes().toString() : new Date(this.data.scheduledDate).getMinutes().toString())
      this.transfer = this.data.activity.hasChildActivity == 1 ? true : false;
      this.activity.routeProfileCode = this.data.routeProfileCode;
      this.subActivity.routeProfileCode = this.data.routeProfileCode;
      for (let route of this.routeProfiles) {
        if (route.code == this.data.activity.routeProfileCode) {
          this.data.routeName = route.name;
        }
      }
    }
    else {
      this.data.scheduledDate = new Date();
      this.data.serviceServiceTypeCode = 1;
      this.data.serviceCode = 1;
      this.data.customerCode = 1;
      this.data.passengersNumber = 1;
      this.data.userProviderCode = 1;
      this.data.locationLocationTypeCode = 0;
      this.data.locationCode = 0;
      //this.data.userAlias = 'jhoel';
      this.data.hour = '00:00';
    }
  }

  getOtherTables() {
    this.customers = this.data.customers;
    this.serviceTypes = this.data.serviceTypes;
    this.services = this.data.services;
    this.locationTypes = this.data.locationTypes;
    this.locations = this.data.locations;
    this.routeProfiles = this.data.routeProfiles;
    this.filterLocations(this.data.activity ? this.data.activity.locationLocationTypeCode : 6);
    this.filteredRoute = this.routeCtrl.valueChanges.pipe(startWith(''), map(route => route ? this._filterRoutes(route) : this.routeProfiles.slice()));
    //this.service.getProvider("provider").subscribe(provider => this.providers = <Provider[]>provider.body.records);
    //this.service.getLocationType("location-type").subscribe(locationType => this.locationTypes = <LocationType[]>locationType.body.records);
    //this.service.getLocation("location").subscribe(location => {this.locations = <Location[]>location.body.records; this.filterLocations(6);});
    /*this.service.getRouteProfile("route-profile").subscribe(route => {
      this.routeProfiles = <RouteProfile[]>route.body.records;
      this.filteredRoute = this.routeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(route => route ? this._filterRoutes(route) : this.routeProfiles.slice()));
    });*/
  }

  confirmAdd() {
    const bottomSheetRef = this.bottomSheet.open(ConfirmationComponent);

    if (this.data.activity) {
      bottomSheetRef.afterDismissed().subscribe((result) => {
        //console.log(result);
        if (result === 1) {
          this.setActivity();
          //this.activity.routeProfileCode = this.data.routeProfileCode;
          this.activity.activityStateCode = this.data.activity.activityStateCode;
          this.activity.hasChildActivity = this.data.activity.hasChildActivity;
          //console.log(this.activity);
          this.service.putActivity("activity", this.activity).subscribe(activity => {
            if (activity.error) {
              this.snackBar.open("No se pudo modificar actividad", "Error", {
                duration: 3000,
              });
              console.log(activity.body);
            }
            else {
              if (this.transfer) {
                if (this.data.activity.hasChildActivity == 0) {
                  this.subActivity = this.activity;
                  this.setSubActivity();
                  this.service.postActivity("activity", this.subActivity).subscribe(subactivity => {
                    if (subactivity.error) {
                      this.snackBar.open("No se pudo crear sub-actividad", "Error", {
                        duration: 3000,
                      });
                      console.log(subactivity.body);
                    }
                    else {
                      this.onNoClick(1);
                    }
                  });
                }
                else {
                  this.findSubActivity(this.data.activity, true);
                }
                //this.setSubActivity();
              }
              else {
                if (this.data.activity.hasChildActivity == 1) {
                  this.findSubActivity(this.data.activity, false);
                }
                else {this.onNoClick(1);}
              }
            }
          });
        }
      });
    }
    else {
      bottomSheetRef.afterDismissed().subscribe((result) => {
        console.log(result);
        if (result === 1) {
          this.setActivity();
          console.log(this.activity);
          this.service.postActivity("activity", this.activity).subscribe(activity => {
            if (activity.error) {
              this.snackBar.open("No se pudo crear actividad", "Error", {
                duration: 3000,
              });
              console.log(activity.body);
            }
            else {
              if (this.transfer) {
                this.subActivity = <Activity>activity.body;
                this.setSubActivity();
                this.service.postActivity("activity", this.subActivity).subscribe(subactivity => {
                  if (subactivity.error) {
                    this.snackBar.open("No se pudo crear sub-actividad", "Error", {
                      duration: 3000,
                    });
                    console.log(subactivity.body);
                  }
                  else {
                    this.onNoClick(1);
                  }
                });
              }
              else {this.onNoClick(1);}
            }
          });
        }
      });
    }
  }

  addNext() {
    const bottomSheetRef = this.bottomSheet.open(ConfirmationComponent);

    bottomSheetRef.afterDismissed().subscribe((result) => {
      console.log(result);
      if (result === 1) {
        this.setActivity();
        this.service.postActivity("activity", this.activity).subscribe(activity => {
          if (activity.error) {
            this.snackBar.open("No se pudo crear actividad", "Error", {
              duration: 3000,
            });
            console.log(activity.body);
          }
          else {
            if (this.transfer) {
              this.subActivity = <Activity>activity.body;
              this.setSubActivity();
              this.service.postActivity("activity", this.subActivity).subscribe(subactivity => {
                if (subactivity.error) {
                  this.snackBar.open("No se pudo crear sub-actividad", "Error", {
                    duration: 3000,
                  });
                  console.log(subactivity.body);
                }
                else {
                  this.onAdd.emit(2);
                }
              });
            }
            this.data.hour = '00:00';
            this.data.serviceCode = 1;
            this.data.customerCode = 1;
            this.data.passengerName = '';
            this.data.remark = '';
            this.transfer ? null : this.onAdd.emit(2);
          }
        });
      }
    });
  }

  setActivity() {
    this.data.scheduledDate.setHours(Number(this.data.hour.split(":")[0]));
    this.data.scheduledDate.setMinutes(Number(this.data.hour.split(":")[1]));
    this.activity.scheduledDate = Math.floor(new Date(this.data.scheduledDate).getTime() / 1000);
    this.activity.serviceServiceTypeCode = this.data.serviceServiceTypeCode;
    this.activity.serviceCode = this.data.serviceCode;
    this.activity.passengerName = this.data.passengerName;
    this.activity.passengersNumber = this.data.passengersNumber;
    this.activity.remark = this.data.remark;
    //this.activity.userAlias = this.data.userAlias;
    //this.activity.userProviderCode = this.data.userProviderCode;
    this.activity.customerCode = this.data.customerCode;
    this.activity.code = this.data.activity ? this.data.activity.code : 0;
    this.activity.activityCode = 0;
    this.activity.locationCode = this.data.locationCode;
    this.activity.locationLocationTypeCode = this.data.locationLocationTypeCode;
    this.subActivity.activityCustomerCode = 0;
    this.subActivity.activityServiceCode = 0;
    this.subActivity.activityServiceServiceTypeCode = 0;
    this.subActivity.locationCode = 0;
    this.subActivity.locationLocationTypeCode = 0;

    this.subActivity.locationCode = 0;
    this.subActivity.locationLocationTypeCode = 0;
  }

  setSubActivity() {
    this.subActivity.activityCode = this.data.activity ? this.activity.code : this.subActivity.code;
    this.subActivity.activityCustomerCode = this.data.activity ? this.activity.customerCode : this.subActivity.customerCode;
    this.subActivity.activityServiceCode = this.data.activity ? this.activity.serviceCode : this.subActivity.serviceCode;
    this.subActivity.activityServiceServiceTypeCode = this.data.activity ? this.activity.serviceServiceTypeCode : this.subActivity.serviceServiceTypeCode;
    this.subActivity.serviceServiceTypeCode = this.data.serviceServiceTypeCode;
    this.subActivity.serviceCode = 1;
    this.subActivity.code = 0;
  }

  filterLocations(locationlocationTypeCode) {
    this.locationFiltered = [];
    for (let location of this.locations) {
      if (location.locationTypeCode == locationlocationTypeCode) {
        this.locationFiltered.push(location);
        //this.data.locationCode = location.locationTypeCode;
      }
    }
  }

  findSubActivity(row, n) {
    if (this.activity != row) {
      this.service.getCustomActivity("activity", '/0/0/' + 
      '0/0/' +
      '0/0/' + 
      '0/0/' + 
      '1/' + row.code + '/' +  
      '1/' + row.customerCode + '/' +  
      '1/' + row.serviceCode + '/' + 
      '1/' + row.serviceServiceTypeCode + '/' + 
      '0/0/' + '0/0/' + '0/a/' + '0/0/' + '0/0/' +
      '0/0/0/' + '0/0/' + '0/0/' + '0/a/' + '0/0/' + 
      '0/a/' + '0/0/0/' + 
      '0/0/0/' + '1/100').pipe(
        map(data => data.body.records[0])).subscribe(data => {
        this.subActivity = <Activity>data;
        if (n) {
          this.data.scheduledDate.setHours(Number(this.data.hour.split(":")[0]));
          this.data.scheduledDate.setMinutes(Number(this.data.hour.split(":")[1]));
          this.subActivity.scheduledDate = Math.floor(new Date(this.data.scheduledDate).getTime() / 1000);
          this.subActivity.locationCode = this.data.locationCode;
          this.subActivity.locationLocationTypeCode = this.data.locationLocationTypeCode;
          this.subActivity.passengerName = this.data.passengerName;
          this.subActivity.passengersNumber = this.data.passengersNumber;
          this.subActivity.remark = this.data.remark;
          this.subActivity.routeProfileCode = this.activity.routeProfileCode;
          this.service.putActivity("activity", this.subActivity).subscribe(subactivity => {
            if (subactivity.error) {
              this.snackBar.open("No se pudo modificar sub-actividad", "Error", {
                duration: 3000,
              });
              console.log(subactivity.body);
            }
            else {
              this.onNoClick(1);
            }
          });
        }
        else {
          this.service.deleteActivity("activity", this.subActivity).subscribe(subactivity => {
            if (subactivity.error) {
              this.snackBar.open("No se pudo eliminar la sub-actividad", "Error", {
                duration: 3000,
              });
              console.log(subactivity.body);
            }
            else {
              this.onNoClick(1);
            }
          });
        }
        //console.log(this.subActivity);
        //this.activity = row;
      });
    }
  }

  select(event, element) {
    if (event.source.selected) {
      this.activity.routeProfileCode = element.code;
      console.log(this.activity.routeProfileCode);
    }
  }

  private _filterRoutes(value: string): object[] {
    const filterValue = value.toLowerCase();
    let array = this.routeProfiles.filter(route => (<RouteProfile>route).name.toLowerCase().includes(filterValue));
    return array;
  }

  onNoClick(i : number): void {
    this.dialogRef.close(i);
  }
}