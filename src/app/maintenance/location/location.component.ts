import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';
import { MatTableDataSource, MatDialog, MatSnackBar, PageEvent, MatPaginator } from '@angular/material';
import { LocationType, Location } from 'src/app/interfaces';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {
  @Input() routeProfileEdit: boolean;
  @Input() locationEdit: boolean;
  @Output() locationEvent = new EventEmitter<Location>();
  @ViewChild(MatPaginator) pagin: MatPaginator;

  constructor(public service: TransportService, public dialog: MatDialog, private snackBar: MatSnackBar) {}
  
  location: Location = {code: 0, locationTypeCode: 0, address: '', latitude: 0, longitude: 0};
  locationType: LocationType = {code: 0, name: ""};
  dataSource = new MatTableDataSource();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['address', 'actionsColumn'];
  locationTypes: LocationType[] = [];
  rpLocations: Location[] = [];
  string: string = "/0/0/0/0/0/a/0/0/0/0/0/0/";
  locationCode = 0;
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  order = 0;
  addLocation = false;
  checked = false;
  isLoading = true;

  ngOnInit() {
    //this.getTable();
    this.getOtherTables();
    this.locationEdit ? null : this.getTable();
  }

  getTable() {
    this.service.getCustomLocation("location", "/0/0/" + 
    (this.checked ? 1 : 0).toString() + '/' + this.locationType.code + '/' + 
    "0/a/0/0/0/0/0/0/" + this.pageIndex + "/" + this.pageSize).subscribe(location => {
      const dataSource = location.body.records.map(item => {
        const container: any = {};
        container.code = (<Location>item).code;
        container.locationTypeCode = (<Location>item).locationTypeCode;
        container.address = (<Location>item).address;
        container.latitude = (<Location>item).latitude;
        container.longitude = (<Location>item).longitude;
        container.routeRef = false;
        return container
      })
      this.isLoading = false;
      this.dataSource.data = dataSource;
      //console.log(this.dataSource.data);
      this.recordsFound = location.body.recordsFound;
    });
  }

  getOtherTables() {
    this.service.getLocationType("location-type").subscribe(locationType => {
      this.locationTypes = <LocationType[]>locationType.body.records;
    });
  }

  addNew() {
    this.location = {code: 0, locationTypeCode: 0, address: '', latitude: 0, longitude: 0};
    this.locationEvent.emit(this.location);
  }

  edit(location) {
    this.locationEvent.emit(location);
  }

  delete(location) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Ubicación', address: location.address },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteLocation("location", location).subscribe(location => {
          if (location.error) {
            this.snackBar.open("No se pudo eliminar la Ubicación porque pertenece a una Ruta", "Error", {
              duration: 4000,
            });
            console.log(location.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino la Ubicación con exito", "Hecho", {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      }
    });
  }

  setLocation(location) {
    console.log(this.dataSource.data);
    location.routeRef = true;
    //this.addLocation = true;
    //this.location = location;
    //this.location.code = this.location.code * -1;
    this.locationEvent.emit(location);
  }

  removeLocation(location) {
    for (let item of this.dataSource.data) {
      if (location.code == (<Location>item).code && location.locationTypeCode == (<Location>item).locationTypeCode) {
        (<any>item).routeRef = false;
      }
    }
    console.log(this.dataSource.data);
    location.routeRef = false;
    location.editing = false;
    //this.addLocation = false;
    this.locationEvent.emit(location);
    //this.location = location;
    //this.location.code = this.location.code * -1;
    //console.log(this.location);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  routeLocationRef() {
    this.service.getCustomLocation("location", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activity => {
      const dataSource = activity.body.records.map(item => {
        const container: any = {};
        container.locationTypeCode = (<Location>item).locationTypeCode;
        container.address = (<Location>item).address;
        container.latitude = (<Location>item).latitude;
        container.longitude = (<Location>item).longitude;
        for (let location of this.rpLocations) {
          if ((location.code < 0 ? location.code * -1 : location.code) == (<Location>item).code && location.locationTypeCode == (<Location>item).locationTypeCode) {
            container.routeRef = true;
          }
        }
        container.routeRef ? container.code = (<Location>item).code * -1 : container.code = (<Location>item).code;
        return container
      })
      this.isLoading = false;
      this.dataSource.data = dataSource;
      this.recordsFound = activity.body.recordsFound;
      this.pagin.pageIndex = this.pageIndex - 1;
    });
  }

  select(code) {
    this.locationType.code = code;
    this.service.getCustomLocation("location", "/0/0/" + 
    (this.checked ? 1 : 0).toString() + '/' + this.locationType.code + '/' + 
    "0/a/0/0/0/0/0/0/1/" + this.pageSize).subscribe(location => {
      const dataSource = location.body.records.map(item => {
        const container: any = {};
        container.code = (<Location>item).code;
        container.locationTypeCode = (<Location>item).locationTypeCode;
        container.address = (<Location>item).address;
        container.latitude = (<Location>item).latitude;
        container.longitude = (<Location>item).longitude;
        for (let location of this.rpLocations) {
          if ((location.code < 0 ? location.code * -1 : location.code) == (<Location>item).code && location.locationTypeCode == (<Location>item).locationTypeCode) {
            container.routeRef = true;
          }
        }
        return container
      })
      this.dataSource.data = dataSource;
      this.recordsFound = location.body.recordsFound;
      this.pagin.pageIndex = 0;
    });
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    console.log(this.rpLocations);
    this.routeLocationRef();
  }

  setTypeLocationFilter(e) {
    if (!e.checked) {
      this.locationType.code = 0;
      this.routeLocationRef();
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.rpLocations, event.previousIndex, event.currentIndex);
  }

  refreshTable() {
    this.getTable();
  }
}