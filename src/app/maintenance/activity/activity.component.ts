import { Component } from '@angular/core';
import { TransportService } from '../../services/transport.service';
import { MatDialog, MatTableDataSource, PageEvent, MatBottomSheet, MatSnackBar } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Customer, ServiceType, Service, ActivityState, Activity, Provider, LocationType, Location, RouteProfile, User, CancellationReason } from 'src/app/interfaces';
import { AddActivityComponent } from '../../dialogs/activity/add/add.activity.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ConfirmationComponent } from 'src/app/dialogs/confirmation/confirmation.component';
import { ActivityAssignComponent } from 'src/app/dialogs/activity-assign/activity.assign.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';
import { TrackService } from '../../services/track.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActivityComponent {

  constructor(public dialog: MatDialog,
    private service: TransportService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private track: TrackService) { 
      this.track.messages.subscribe(msg => {
        if (msg.activityStateChanged) {
          this.refreshTable();
        }
      });
    }
  
  customerCtrl = new FormControl({value: '', disabled: true});
  filteredCustomer: Observable<object[]>;
  serviceCtrl = new FormControl({value: '', disabled: true});
  filteredService: Observable<object[]>;
  locationTypeCtrl = new FormControl({value: '', disabled: true});
  locationCtrl = new FormControl({value: '', disabled: true});
  filteredlocation: Observable<object[]>;

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
  activity: Activity;

  dataSource = new MatTableDataSource();
  pageEvent: PageEvent;
  columnsToDisplay = ['nro', 'hour', 'serviceCode', 'passengerName', 'passengersNumber', 'routeProfileCode','customerCode', 'transfer', 'activityState', 'actionsColumn'];
  //activities: Activity[] = [];
  locationType: LocationType = {code: 1, name: ''};
  customers: Customer[] = [];
  serviceTypes: ServiceType[] = [];
  services: Service[] = [];
  activityStates: ActivityState[] = [];
  providers: Provider[] = [];
  locationTypes: LocationType[] = [];
  locations: Location[] = [];
  routeProfiles: RouteProfile[] = [];
  cancellations: CancellationReason[] = [];
  users: User[] = [];
  filter: any = {};
  string: string = "/0/0/0/0/0/0/0/0/1/-1/1/-1/1/-1/1/-1/0/0/0/0/0/a/0/0/0/0/0/0/0/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/";
  isLoading = true;
  byDate = false;
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;

  ngOnInit() {
    this.getTable();
    this.getOtherTables();
    this.filteredCustomer = this.customerCtrl.valueChanges
    .pipe(
      startWith(''),
      map(customer => customer ? this._filterCustomers(customer, 1) : this.customers.slice())
    );

    this.filteredService = this.serviceCtrl.valueChanges
    .pipe(
      startWith(''),
      map(service => service ? this._filterCustomers(service, 2) : this.services.slice())
    );

    this.filteredlocation = this.locationCtrl.valueChanges
    .pipe(
      startWith(''),
      map(location => location ? this._filterCustomers(location, 3) : this.locations.slice())
    );
    this.filter.scheduledDateA = new Date();
    //this.filter.scheduledDateA.setHours(0);
    //this.filter.scheduledDateA.setMinutes(0);
    this.filter.scheduledDateB = new Date();
    //this.filter.scheduledDateB.setHours(11);
    //this.filter.scheduledDateB.setMinutes(59);
  }

  getOtherTables() {
    this.service.getCustomer("customer").subscribe(customer => {this.customers = <Customer[]>customer.body.records;});
    this.service.getServiceType("service-type").subscribe(serviceType => {this.serviceTypes = <ServiceType[]>serviceType.body.records;});
    this.service.getServiceByTypeService("service").subscribe(service => {this.services = <Service[]>service.body.records;});
    this.service.getActivityState("activity-state").subscribe(activityState => {this.activityStates = <ActivityState[]>activityState.body.records;});
    this.service.getProvider("provider").subscribe(provider => {this.providers = <Provider[]>provider.body.records});
    this.service.getLocationType("location-type").subscribe(locationType => this.locationTypes = <LocationType[]>locationType.body.records);
    this.service.getLocation("location").subscribe(location => this.locations = <Location[]>location.body.records);
    this.service.getRouteProfile("route-profile").subscribe(route => {this.routeProfiles = <RouteProfile[]>route.body.records;});
    this.service.getUserOperator("user").subscribe(user => {this.users = <User[]>user.body.records;});
    this.service.getCancellationReason("cancellation-reason").subscribe(cancel => {this.cancellations = <CancellationReason[]>cancel.body.records;});
  }

  getTable() {
    this.service.getCustomActivity("activity", this.string + this.pageIndex + '/' + this.pageSize).subscribe(activity => {
      this.isLoading = false;
      this.dataSource.data = activity.body.records;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  assign(activity: Activity) {
    const dialogRef = this.dialog.open(ActivityAssignComponent, {
      disableClose: true,
      data: activity
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  cancelAssign(activity) {
    const bottomSheetRef = this.bottomSheet.open(ConfirmationComponent);
    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result === 1) {
        this.service.cancelActivity("activity", activity).subscribe(data => {
          if (data.error) {
            console.log(data);
          }
          else {
            this.refreshTable();
          }
        });
      }
    });
  }

  addNew() {
    const dialogRef = this.dialog.open(AddActivityComponent, {
      disableClose: true,
      data: {customers: this.customers, serviceTypes: this.serviceTypes, services: this.services, locations: this.locations, locationTypes: this.locationTypes, routeProfiles: this.routeProfiles}
    });

    dialogRef.componentInstance.onAdd.subscribe(result => {
      console.log("dialog: " + result);
      if (result === 2) {
        this.refreshTable();
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result: " + result)
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(activity) {
    const dialogRef = this.dialog.open(AddActivityComponent, {
      disableClose: true,
      data: {activity: activity, customers: this.customers, serviceTypes: this.serviceTypes, services: this.services, locations: this.locations, locationTypes: this.locationTypes, routeProfiles: this.routeProfiles}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  addSubActivity(passengerName, passengersNumber, remark, activityStateCode, code, customerCode, serviceCode, serviceServiceTypeCode, scheduledDate, locationLocationTypeCode, locationCode, routeProfileCode) {
    const bottomSheetRef = this.bottomSheet.open(ConfirmationComponent);

    bottomSheetRef.afterDismissed().subscribe((result) => {
      console.log(result);
      if (result === 1) {
        this.subActivity.passengerName = passengerName;
        this.subActivity.passengersNumber = passengersNumber;
        this.subActivity.remark = remark;
        this.subActivity.scheduledDate = scheduledDate;
        this.subActivity.customerCode = customerCode;
        this.subActivity.activityCode = code;
        this.subActivity.activityCustomerCode = customerCode;
        this.subActivity.activityServiceCode = serviceCode;
        this.subActivity.activityServiceServiceTypeCode = serviceServiceTypeCode;
        this.subActivity.activityStateCode = activityStateCode;
        this.subActivity.locationCode = locationCode;
        this.subActivity.locationLocationTypeCode = locationLocationTypeCode;
        this.subActivity.routeProfileCode = routeProfileCode;
        this.subActivity.serviceServiceTypeCode = serviceServiceTypeCode;
        this.subActivity.serviceCode = 1;
        this.subActivity.code = 0;
        this.service.postActivity("activity", this.subActivity).subscribe(activity => {
          console.log(activity.body);
          this.refreshTable();
        });
      }
    });
  }

  delete(activity) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Actividad', address: activity.remark },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        if (activity.hasChildActivity == 1) {
          this.findSubActivity(activity, true);
        }
        else {
          this.service.deleteActivity("activity", activity).subscribe(subactivity => {
            if (subactivity.error) {
              this.snackBar.open("No se pudo eliminar la sub-actividad", "Error", {
                duration: 3000,
              });
              console.log(subactivity.body);
            }
            else {
              this.refreshTable();
            }
          });
        }
      }
    });
  }

  findSubActivity(row, del) {
    if (this.activity != row) {
      this.service.getCustomActivity("activity", '/0/0/' + 
      '0/0/' +
      '0/0/' + 
      '1/' + row.serviceServiceTypeCode + '/' + 
      '1/' + row.code + '/' +  
      '1/' + row.customerCode + '/' +  
      '1/' + row.serviceCode + '/' + 
      '1/' + row.serviceServiceTypeCode + '/' + 
      '0/0/' + '0/0/' + '0/a/' + '0/0/' + '0/0/' +
      '0/0/0/' + '0/0/' + '0/0/' + '0/a/' + '0/0/' + 
      '0/a/' + '0/0/0/' + 
      '0/0/0/' + '1/' + this.pageSize).pipe(
        map(data => data.body.records[0])).subscribe(data => {
        this.subActivity = <Activity>data;
        this.activity = row;

        if (del) {
          this.service.deleteActivity("activity", this.subActivity).subscribe(subactivity => {
            if (subactivity.error) {
              this.snackBar.open("No se pudo eliminar la sub-actividad", "Error", {
                duration: 3000,
              });
              console.log(subactivity.body);
            }
            else {
              this.service.deleteActivity("activity", row).subscribe(activity => {
                if (activity.error) {
                  this.snackBar.open("No se pudo eliminar la sub-actividad", "Error", {
                    duration: 3000,
                  });
                  console.log(activity.body);
                }
                else {
                  this.refreshTable();
                }
              });
            }
          });
        }
      });
    }
  }

  select(event, element, n) {
    if (event.source.selected) {
      if (n == 1) {
        this.filter.customer = element.code;
      }
      else if (n == 2) {
        this.filter.service = element.code;
        this.filter.serviceType = element.serviceTypeCode;
      }
      else if (n == 3) {
        this.filter.location = element.code;
        //this.filter.locationType = element.locationTypeCode;
      }
      else if (n == 4) {
        this.filter.locationType = element;
      }
    }
  }

  findActivity() {
    if (this.byDate) {
      this.filter.scheduledDateA.setHours(0);
      this.filter.scheduledDateA.setMinutes(0);
      this.filter.scheduledDateA.setSeconds(0);
      this.filter.scheduledDateB.setHours(11);
      this.filter.scheduledDateB.setMinutes(59);
      this.filter.scheduledDateB.setSeconds(59);
    }
    this.isLoading = true;
    this.dataSource.data = [];
    this.string = '/0/0/' + 
    (!this.customerCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.customer ? this.filter.customer : 0).toString() + '/' + 
    (!this.serviceCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.service ? this.filter.service : 0).toString() + '/' + 
    (!this.serviceCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.service ? this.filter.serviceType : 0).toString() + '/' + 
    '1/-1/' + '1/-1/' + '1/-1/' + '1/-1/' + 
    '0/0/' + '0/0/' + '0/a/' + 
    '0/0/' + '0/0/' +
    (this.byDate ? 1 : 0).toString() + "/" + (this.filter.scheduledDateA ? Math.floor(new Date(this.filter.scheduledDateA).getTime() / 1000) : 0).toString() + '/' +
    (this.filter.scheduledDateB ? Math.floor(new Date(this.filter.scheduledDateB).getTime() / 1000) : 0).toString() + '/' + 
    (!this.locationCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.location ? this.filter.location : 0).toString() + '/' + 
    (!this.locationTypeCtrl.disabled ? 1 : 0).toString() + '/' + (this.filter.locationType ? this.filter.locationType : 0).toString() + '/' + 
    '0/a/' + '0/0/' + '0/a/' + '0/0/0/' + 
    '0/0/0/';
    console.log(this.filter.scheduledDateA);
    console.log(this.filter.scheduledDateB);
    this.service.getCustomActivity("activity", this.string + this.pageIndex + '/' + this.pageSize).subscribe(data => {
      this.isLoading = false;
      this.dataSource.data = data.body.records;
      this.recordsFound = data.body.recordsFound;
    }, error => this.isLoading = false);
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    this.service.getCustomActivity("activity", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activity => {
      this.isLoading = false;
      this.dataSource.data = activity.body.records;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  private _filterCustomers(value: string, n: number): object[] {
    const filterValue = value.toLowerCase();
    let array;
    if (n == 1) {
      array = this.customers.filter(customer => (<Customer>customer).name.toLowerCase().includes(filterValue));
    }
    else if (n == 2) {
      array = this.services.filter(service => (<Service>service).name.toLowerCase().includes(filterValue));
    }
    else if (n == 3) {
      array = this.locations.filter(location => (<Location>location).address.toLowerCase().includes(filterValue));
    }
    return array;
  }

  report() {
    this.service.getActivityReport("activity", this.string + this.pageIndex + "/" + this.pageSize).subscribe(report => {
      var byteCharacters = atob(report.body + '');
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}
