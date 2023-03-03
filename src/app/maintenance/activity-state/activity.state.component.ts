import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent, MatSnackBar} from '@angular/material';
import { TransportService } from 'src/app/services/transport.service';
import { ActivityState } from 'src/app/interfaces';
import { ActivityStateAddComponent } from 'src/app/dialogs/activity-state/activity.state.add.component';
import { DeleteComponent } from 'src/app/dialogs/delete/delete.component';

@Component({
  selector: 'app-activityState',
  templateUrl: './activity.state.component.html',
  styleUrls: ['./activity.state.component.css']
})
export class ActivityStateComponent {

  constructor(public dialog: MatDialog, private service: TransportService, private snackBar: MatSnackBar) { }

  dataSource = new MatTableDataSource();
  activityState: ActivityState = {code: 0, name: ''};
  displayedColumns: string[] = ['code', 'name', 'actionsColumn'];
  pageEvent: PageEvent;
  string: string = "/0/0/0/a/";
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  isLoading = true;

  ngOnInit() {
    this.getTable();
  }

  getTable() {
    this.service.getCustomActivityState("activity-state", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activityState => {
      this.isLoading = false;
      this.dataSource.data = activityState.body.records;
      this.recordsFound = activityState.body.recordsFound;
    }, error => this.isLoading = false);
  }

  addNew() {
    const dialogRef = this.dialog.open(ActivityStateAddComponent, {
      data: {code: 0, name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(activityState) {
    const dialogRef = this.dialog.open(ActivityStateAddComponent, {
      data: activityState
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  deleteItem(activityState) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: 'Estado de Actividad', address: activityState.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result > 0) {
        this.service.deleteActivityState("activity-state", activityState).subscribe(activityState => {
          if (activityState.error) {
            this.snackBar.open("No se pudo eliminar el estado de Actividad", "Error", {
              duration: 4000,
            });
            console.log(activityState.body);
          }
          else {
            this.refreshTable();
            this.snackBar.open("Se elimino el estado de Actividad con exito", "Hecho", {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      }
    });
  }

  paginator(event) {
    this.pageEvent = event;
    this.dataSource.data = [];
    this.isLoading = true;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.pageSize = this.pageEvent.pageSize;
    this.service.getCustomActivityState("activity-state", this.string + this.pageIndex + "/" + this.pageSize).subscribe(activityState => {
      this.isLoading = false;
      this.dataSource.data = activityState.body.records;
      this.recordsFound = activityState.body.recordsFound;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshTable() {
    this.getTable();
  }
}