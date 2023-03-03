import {Component, Input, Output, EventEmitter} from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';
import { MatTableDataSource, MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { RouteProfile, RouteProfileLocation } from 'src/app/interfaces';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-routeProfile',
  templateUrl: './routeProfile.component.html',
  styleUrls: ['./routeProfile.component.css'],
})
export class RouteProfileComponent {
  @Input() routeProfileEdit: boolean;
  @Input() locationEdit: boolean;
  @Output() routeProfileEvent = new EventEmitter<RouteProfile>();
  
  constructor(public service: TransportService, public dialog: MatDialog, private snackBar: MatSnackBar) {}

  dataSource = new MatTableDataSource();
  routeProfile: RouteProfile = {code: 0, name: '', description: ''};
  rProfileLocations: RouteProfileLocation[];
  displayedColumns: string[] = ['name', 'actionsColumn'];
  pageEvent: PageEvent;
  string: string = "/0/0/0/a/0/a/";
  isLoading = true;
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;

  ngOnInit() {
    this.getTable();
  }

  getTable() {
    this.service.getCustomRouteProfile("route-profile", this.string + this.pageIndex + "/" + this.pageSize).subscribe(routeProfile => {
      this.isLoading = false;
      this.dataSource.data = routeProfile.body.records;
      this.recordsFound = routeProfile.body.recordsFound;
    });
  }

  addNew() {
    this.routeProfile = {code: 0, name: '', description: ''};
    this.routeProfileEvent.emit(this.routeProfile);
  }

  edit(routeProfile) {
    this.routeProfileEvent.emit(routeProfile);
  }

  delete(routeProfile) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Ruta', address: routeProfile.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.getCustomRouteProfileLocation("route-profile-location", "/1/" + routeProfile.code + "/0/0/0/0/0/0/1/100").subscribe(data => {
          this.rProfileLocations = <RouteProfileLocation[]>data.body.records;
          let i = 0;
          if (this.rProfileLocations.length > 0) {
            for (let rpLocation of this.rProfileLocations) {
              this.service.deleteRouteProfileLocation("route-profile-location", rpLocation).subscribe(rpLocation => {
                if (rpLocation.error) {
                  console.log(rpLocation.body);
                }
                else {
                  i++;
                  if (i == this.rProfileLocations.length) {
                    this.deleteRouteProfile(routeProfile);
                  }
                }
              });
            }
          }
          else {
            this.deleteRouteProfile(routeProfile);
          }
        });
      }
    });
  }

  deleteRouteProfile(routeProfile) {
    this.service.deleteRouteProfile("route-profile", routeProfile).subscribe(routeProfile => {
      if (routeProfile.error) {
        this.snackBar.open("No se pudo eliminar la Ruta", "Error", {
          duration: 4000,
        });
        console.log(routeProfile.body);
      }
      else {
        this.refreshTable();
        this.snackBar.open("Se elimino la Ruta con exito", "Hecho", {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.refreshTable();
      }
    });
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    this.service.getCustomRouteProfile("route-profile", this.string + this.pageIndex + "/" + this.pageSize).subscribe(routeProfile => {
      this.isLoading = false;
      this.dataSource.data = routeProfile.body.records;
      this.recordsFound = routeProfile.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}