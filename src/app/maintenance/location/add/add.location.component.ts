import {Component, Input, Output, EventEmitter} from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';
import { LocationType, Location } from 'src/app/interfaces';
import { trigger, transition, state, animate, style } from '@angular/animations';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-addlocation',
  templateUrl: './add.location.component.html',
  styleUrls: ['./add.location.component.css'],
  animations: [
    trigger('childAnimation', [
      // ...
      state('open', style({
        height: '71px',
        opacity: 1
      })),
      state('closed', style({
        height: '0px',
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class LocationAddComponent {
  @Input() isEditing: boolean;
  //@Input() location: Location;
  @Input() code: number; 
  @Input() locationTypeCode: number;
  @Input() lo: number;
  @Input() la: number;
  @Input() address: string;
  @Output() addLocationClose = new EventEmitter<number>();

  constructor(public service: TransportService, private snackBar: MatSnackBar) {}

  latitude: number = -13.51678;
  longitude: number = -71.97881;
  locationTypes: LocationType[] = [];
  locationType: LocationType = {code: 1, name: ""};
  location: Location = {code: 0, locationTypeCode: 1, address: '', latitude: 0, longitude: 0};

  ngOnInit() {
    this.service.getLocationType("location-type").subscribe(locationType => {
      this.locationTypes = <LocationType[]>locationType.body.records;
    });
  }

  addLocation() {
    console.log(this.code);
    if (this.code > 0) {
      this.location.code = this.code;
      this.location.locationTypeCode = this.locationTypeCode;
      this.location.longitude = this.lo;
      this.location.latitude = this.la;
      this.location.address = this.address;
      console.log(this.location);
      this.service.putLocation("location", this.location).subscribe(location => {
        if (location.error) {
          this.snackBar.open("No se pudo actualizar la Ubicacion", "Error", {
            duration: 3000,
          });
          console.log(location.body);
        }
        else {
          this.snackBar.open("Se realizo los cambios con exito", "Hecho", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.addLocationClose.emit(1);
          this.isEditing = false;
        }
      });
    }
    else {
      this.location.code = 0;
      this.location.locationTypeCode = this.locationTypeCode;
      this.location.longitude = this.lo;
      this.location.latitude = this.la;
      this.location.address = this.address;
      console.log(this.location);
      this.service.postLocation("location", this.location).subscribe(location => {
        if (location.error) {
          this.snackBar.open("No se pudo crear Ubicacion", "Error", {
            duration: 3000,
          });
          console.log(location);
        }
        else {
          this.snackBar.open("Se creo la Ubicacion con exito", "Hecho", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.addLocationClose.emit(1);
          this.isEditing = false;
          this.address = '';
        }
      });
    }
    //console.log(this.location);
  }

  close() {
    this.addLocationClose.emit(0);
    this.isEditing = false;
    this.code == 0 ? this.address = '' : this.address = this.address;
    this.code == 0 ? this.la = this.latitude : this.la = this.la;
    this.code == 0 ? this.lo = this.longitude : this.lo = this.lo;
    //this.location.locationTypeCode == 1 ? this.location.locationTypeCode = 1 : this.location.locationTypeCode = this.location.locationTypeCode;
  }
}