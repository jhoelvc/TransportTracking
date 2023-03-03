import {Component, Input, Output, EventEmitter} from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';
import { RouteProfile } from 'src/app/interfaces';
import { trigger, transition, state, animate, style } from '@angular/animations';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-addrouteprofile',
  templateUrl: './add.routeprofile.component.html',
  styleUrls: ['./add.routeprofile.component.css'],
  animations: [
    trigger('childAnimation', [
      // ...
      state('open', style({
        height: '85px',
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
export class RouteProfileAddComponent {
  @Input() isEditing: boolean;
  @Input() routeProfile: RouteProfile;
  @Input() name: string;
  @Input() description: string;
  @Input() locations: Location[] = [];
  @Output() addRouteProfileClose = new EventEmitter<number>();

  constructor(public service: TransportService, private snackBar: MatSnackBar) {}

  //routeProfile: RouteProfile = {code: 0, name: '', description: ''};

  ngOnInit() {
    
  }

  addRoute() {
    console.log(this.name);
    if(this.routeProfile.code > 0) {
      this.routeProfile.name = this.name;
      this.routeProfile.description = this.description;
      this.service.putRouteProfile("route-profile", this.routeProfile).subscribe(route => {
        if (route.error) {
          this.snackBar.open("No se pudo actualizar la ruta", "Error", {
            duration: 3000,
          });
          console.log(route.body);
        }
        else {
          //this.routeProfile = <RouteProfile>route.body;
          this.snackBar.open("Se realizo los cambios con exito", "Hecho", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.addRouteProfileClose.emit(this.routeProfile.code);
        }
      });
    }
    else {
      this.routeProfile.code = 0;
      this.routeProfile.name = this.name;
      this.routeProfile.description = this.description;
      this.service.postRouteProfile("route-profile", this.routeProfile).subscribe(route => {
        if (route.error) {
          this.snackBar.open("No se pudo crear la ruta", "Error", {
            duration: 3000,
          });
          console.log(route.body);
        }
        else {
          this.snackBar.open("Se creo la ruta con exito", "Hecho", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.routeProfile = <RouteProfile>route.body;
          this.name = "";
          this.description = "";
          this.addRouteProfileClose.emit(this.routeProfile.code * -1);
        }
      });
    }
  }

  close() {
    this.addRouteProfileClose.emit(0);
    this.isEditing = false;
    this.routeProfile.code == 0 ? this.name = '' : this.name = this.name;
    this.routeProfile.code == 0 ? this.description = '' : this.description = this.description;
  }
}