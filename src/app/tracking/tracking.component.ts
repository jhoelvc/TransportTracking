import {Component, OnInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TransportService } from '../services/transport.service';
import { MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { ActivityState, Service, Session, User, Activity, Location } from '../interfaces';
import { TrackService } from '../services/track.service';
import { map } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";

declare var ol: any;
const subject = webSocket("wss://199.195.116.121:8181/Transport/echo/device-location?" + localStorage.getItem("accessToken"));

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TrackingComponent implements OnInit {

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
  locations: Location[] = [];
  activity: Activity;
  session: Session;
  map =  new ol.Map();
  layerRoute = new ol.layer.Vector({});
  vectorLayer = new ol.layer.Vector({});
  vectorSource = new ol.source.Vector({});
  popup = new ol.Overlay({});
  view = new ol.View({});
  latitude: number = -13.51678;
  longitude: number = -71.97881;
  temp : any = {};
  hideall = false;
  
  constructor(private service: TransportService, private track: TrackService) { 
    this.track.messages.subscribe(msg => {
      if (msg.activityStateChanged) {
        this.refreshTable();
      }
      this.session = <Session>msg.session;
      this.updateMarker(this.session, msg);
    });
    /*subject.subscribe(
      msg => {
        this.session = (<any>msg).session;
        console.log(msg);
        //this.updateMarker(this.session, msg);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );*/
  }

  activityState: ActivityState = {code: 0, name: ''};
  dataSource = new MatTableDataSource();
  activityStates: ActivityState[] = [];
  services: Service[] = [];
  users: User[] = [];
  route: any[] = [];
  string: string = "/0/0/0/0/0/0/0/0/1/-1/1/-1/1/-1/1/-1/0/0/0/0/0/a/0/0/0/0/0/0/0/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/";
  columnsToDisplay: string[] = ['color', 'hour', 'remark', 'actionsColumn'];
  isLoading = true;
  checked = false;
  recordsFound = 0;
  pageIndex = 1;
  pageSize = 25;
  dateA = new Date();
  dateB = new Date();

  ngOnDestroy() {
    //this.track.messages.unsubscribe();
  }

  ngOnInit() {
    this.dateA.setHours(0);
    this.dateA.setMinutes(0);
    this.dateA.setSeconds(0);
    this.dateB.setTime(this.dateA.getTime());
    this.dateB.setHours(23);
    this.dateB.setMinutes(59);
    this.dateB.setSeconds(59);
    this.drawMap();
    this.getTable();
    this.getOtherTables();
  }

  getTable() {
    this.string = '/0/0/0/0/0/0/0/0/1/-1/1/-1/1/-1/1/-1/0/0/0/0/0/a/0/0/0/0/1/' + 
    Math.floor(this.dateA.getTime() / 1000) + '/' + 
    Math.floor(this.dateB.getTime() / 1000) +'/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/';
    /*this.service.getCustomActivity("activity", this.string + this.pageIndex + '/' + this.pageSize).subscribe(activity => {
      //this.isLoading = false;
      this.dataSource.data = activity.body.records;
      this.recordsFound = activity.body.recordsFound;
    });*/

    this.service.getCustomActivity("activity", this.string + this.pageIndex + '/' + this.pageSize).subscribe(activity => {
      const dataSource = activity.body.records.map(item => {
        const container: any = {};
        container.code = (<Activity>item).code;
        container.customerCode = (<Activity>item).customerCode;
        container.serviceCode = (<Activity>item).serviceCode;
        container.serviceServiceTypeCode = (<Activity>item).serviceServiceTypeCode;
        container.activityStateCode = (<Activity>item).activityStateCode;
        container.scheduledDate = (<Activity>item).scheduledDate;
        container.passengerName = (<Activity>item).passengerName;
        container.passengersNumber = (<Activity>item).passengersNumber;
        container.userAlias = (<Activity>item).userAlias;
        container.routeProfileCode = (<Activity>item).routeProfileCode;
        container.hasChildActivity = (<Activity>item).hasChildActivity;
        this.temp.code == container.code && this.temp.customerCode == container.customerCode && this.temp.serviceCode == container.serviceCode && this.temp.serviceServiceTypeCode == container.serviceServiceTypeCode ? container.view = true : container.view = false;
        return container
      })
      //this.isLoading = false;
      this.dataSource.data = dataSource;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  getOtherTables() {
    this.service.getServiceByTypeService("service").subscribe(service => {this.services = <Service[]>service.body.records;});
    this.service.getActivityState("activity-state").subscribe(activityState => {this.activityStates = <ActivityState[]>activityState.body.records;});
    this.service.getUserOperator("user").subscribe(user => {this.users = <User[]>user.body.records;});
  }

  updateMarker(track: Session, msg) {
    var currentMarker = this.vectorSource.getFeatureById(track.alias);
    if (msg.isSessionActive) {
      if(currentMarker != null) {
        currentMarker.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([msg.longitude, msg.latitude])));
        //console.log("Ubicacion actualizada: " + track.alias + " estado - " + msg.activityStateChanged);
      }
      else {
        this.addMarker(track, msg.longitude, msg.latitude);
      }
    }
    else {
      currentMarker ? this.vectorSource.removeFeature(currentMarker) : null;
    }
  }

  addMarker(track: Session, lo: number, la: number) {
    var img = '';

    if (track.alias.split("_").length > 1) {
      track.alias.split("_")[1] == "TRF" ? img = 'assets/transfer.png' : img =  'assets/transport.png';
    }
    else {
      img = 'assets/per-32.png';
    }

    const markerStyle = [new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 1.1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        /*scale: 0.15,*/
        src: img
      })),
      text: new ol.style.Text({
        text: track.alias.split("_")[0],
        scale: 1.3,
        padding: [0,0,50,0],
        fill: new ol.style.Fill({
          color: '#000000'
        }),
        stroke: new ol.style.Stroke({
          color: '#FFFF99',
          width: 3
        })
      }),
    }),];

    var marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lo, la])),
      session: track
    });
    marker.setStyle(markerStyle);
    marker.setId(track.alias);

    this.vectorSource.addFeature(marker);
    
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      //style: markerStyle,
    });

    this.map.addLayer(this.vectorLayer);

    /*var select = new ol.interaction.Select({
      condition: ol.events.condition.singleClick,
      toggleCondition: ol.events.condition.shiftKeyOnly,
      //layers: marker,
      style: markerStyle
    });

    var translate = new ol.interaction.Translate({
      features: select.getFeatures()
    });

    this.map.getInteractions().extend([select, translate]);*/
  }

  drawRoute(activity: Activity) {
    this.map.getLayers().getArray().length > 1 ? this.map.removeLayer(this.layerRoute) : null;
    this.service.getCustomTrack("track", '/0/0/1/' + activity.code + '/1/' + activity.customerCode + 
    '/1/' + activity.serviceCode + '/1/' + activity.serviceServiceTypeCode + '/1/100').subscribe(data => {
      const path = data.body.records.map(item => {
        const container = [];
        container[0] = (<Location>item).longitude;
        container[1] = (<Location>item).latitude;
        return ol.proj.fromLonLat(container);
      });
      //var lineString = new ol.geom.LineString(path);
      this.layerRoute =  new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({ geometry: new ol.geom.LineString(path) })]
        }),
        style: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              width: 4, 
              color: 'rgba(255, 1, 1, 1)',
              lineDash: [3, 5]
            }),
            zIndex: 2
          })
        ],
        updateWhileAnimating: true
      });

      this.map.addLayer(this.layerRoute);
      var extent = this.layerRoute.getSource().getExtent();
      this.map.getView().fit(extent, {size: this.map.getSize(), padding: [150, 50, 150, 50], maxZoom: 15});

      for (var i = 0; i < 2; i++) {
        const markerStyle = [new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 1.1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 0.12,
            src: i == 0 ? 'assets/marker_start.png' : 'assets/marker_finish.png'
          })),
        }),];
  
        var marker = new ol.Feature({
          geometry: new ol.geom.Point(i == 0 ? path[0] : path[path.length - 1]),
        });
        this.route.push(marker);
        marker.setStyle(markerStyle);
        this.vectorSource.addFeature(marker);
        this.vectorLayer = new ol.layer.Vector({
          source: this.vectorSource,
        });
        this.map.addLayer(this.vectorLayer);
      }
    });
  }

  dropRoute(row) {
    this.map.getLayers().getArray().length > 1 ? this.map.removeLayer(this.layerRoute) : null;
    for (let route of this.route) {
      this.vectorSource.removeFeature(route);
    }
    this.route = [];
    row.view = false;
    this.temp.code = 0;
    this.temp.customerCode = 0;
    this.temp.serviceCode = 0;
    this.temp.serviceServiceTypeCode = 0;
  }

  drawMap() {
    var baseMapLayer = new ol.layer.Tile({
      source: new ol.source.OSM({})
    });

    this.view = new ol.View({
      center: ol.proj.fromLonLat([this.longitude, this.latitude]),
      zoom: 13
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [baseMapLayer],
      view: this.view
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  select(code, event: MatDatepickerInputEvent<Date>) {
    if (event) {
      this.dateA = event.value;
      this.dateA.setHours(0);
      this.dateA.setMinutes(0);
      this.dateA.setSeconds(0);
      this.dateB.setTime(this.dateA.getTime());
      this.dateB.setHours(23);
      this.dateB.setMinutes(59);
      this.dateB.setSeconds(59);
    }
    code ? this.activityState.code = code : null;
    this.service.getCustomActivity("activity", 
    "/0/0/0/0/0/0/0/0/1/-1/1/-1/1/-1/1/-1/" + 
    (this.checked ? 1 : 0).toString() + "/" + this.activityState.code +
    "/0/0/0/a/0/0/0/0/1/" + Math.floor(this.dateA.getTime() / 1000) + '/' + 
    Math.floor(this.dateB.getTime() / 1000) + "/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/" + this.pageIndex + '/' + this.pageSize).subscribe(activity => {
      const dataSource = activity.body.records.map(item => {
        const container: any = {};
        container.code = (<Activity>item).code;
        container.customerCode = (<Activity>item).customerCode;
        container.serviceCode = (<Activity>item).serviceCode;
        container.serviceServiceTypeCode = (<Activity>item).serviceServiceTypeCode;
        container.activityStateCode = (<Activity>item).activityStateCode;
        container.scheduledDate = (<Activity>item).scheduledDate;
        container.passengerName = (<Activity>item).passengerName;
        container.passengersNumber = (<Activity>item).passengersNumber;
        container.userAlias = (<Activity>item).userAlias;
        container.routeProfileCode = (<Activity>item).routeProfileCode;
        container.hasChildActivity = (<Activity>item).hasChildActivity;
        this.temp.code == container.code && this.temp.customerCode == container.customerCode && this.temp.serviceCode == container.serviceCode && this.temp.serviceServiceTypeCode == container.serviceServiceTypeCode ? container.view = true : container.view = false;
        return container
      })
      //this.isLoading = false;
      this.dataSource.data = dataSource;
      this.recordsFound = activity.body.recordsFound;
    });
  }

  setActivityStateFilter(e) {
    if (!e.checked) {
      this.activityState.code = 0;
      this.select(this.activityState.code, null);
    }
  }

  findSubActivity(row) {
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
      '0/0/0/' + '1/' + this.pageSize).pipe(
        map(data => data.body.records[0])).subscribe(data => {
        this.subActivity = <Activity>data;
        this.activity = row;
      });
    }
  }

  animateSubActivity(row) {
    this.service.getCustomActivity("activity", '/0/0/' + 
    '0/0/' + '0/0/' + '0/0/' + 
    '1/' + row.code + '/' +  
    '1/' + row.customerCode + '/' +  
    '1/' + row.serviceCode + '/' + 
    '1/' + row.serviceServiceTypeCode + '/' + 
    '0/0/' + '0/0/' + '0/a/' + '0/0/' + '0/0/' +
    '0/0/0/' + '0/0/' + '0/0/' + '0/a/' + '0/0/' + 
    '0/a/' + '0/0/0/' + '0/0/0/' + '1/' + this.pageSize).pipe(
      map(data => data.body.records[0])).subscribe(data => {
      this.vectorSource.getFeatureById((<Activity>data).userAlias) ?
      this.vectorLayer.animateFeature(this.vectorSource.getFeatureById((<Activity>data).userAlias), 
      [	new ol.featureAnimation['Zoom'](
        {	speed: Number(1.5),
          duration: Number(1000 - 1.5 * 300)
        }),
        new ol.featureAnimation['Bounce'](
        {	speed: Number(1.5), 
          duration: Number(1000 - 1.5 * 300),
          horizontal: /Slide/.test('Zoom')
        })
      ]) : null;
    });
  }

  viewActivity(row) {
    row.view = true;
    this.temp.code = row.code;
    this.temp.customerCode = row.customerCode;
    this.temp.serviceCode = row.serviceCode;
    this.temp.serviceServiceTypeCode = row.serviceServiceTypeCode;
    if (row.activityStateCode < 4 || row.activityStateCode == 5) {
      this.service.getLocationByRouteProfile("location", row.routeProfileCode).subscribe(data => {
        this.locations = <Location[]>data.body.records;
        this.marker(0, this.locations[0].longitude, this.locations[0].latitude);
        if (row.activityStateCode == 5) {
          if (row.hasChildActivity == 1) {
            this.vectorSource.getFeatureById(row.userAlias) ? 
            this.vectorLayer.animateFeature(this.vectorSource.getFeatureById(row.userAlias), 
            [	new ol.featureAnimation['Zoom'](
              {	speed: Number(1.5),
                duration: Number(1000 - 1.5 * 300)
              }),
              new ol.featureAnimation['Bounce'](
              {	speed: Number(1.5), 
                duration: Number(1000 - 1.5 * 300),
                horizontal: /Slide/.test('Zoom')
              })
            ]) : null;
            this.animateSubActivity(row);
          }
          else {
            this.vectorSource.getFeatureById(row.userAlias) ? 
            this.vectorLayer.animateFeature(this.vectorSource.getFeatureById(row.userAlias), 
            [	new ol.featureAnimation['Zoom'](
              {	speed: Number(1.5),
                duration: Number(1000 - 1.5 * 300)
              }),
              new ol.featureAnimation['Bounce'](
              {	speed: Number(1.5), 
                duration: Number(1000 - 1.5 * 300),
                horizontal: /Slide/.test('Zoom')
              })
            ]) : null;
          }
        }
      });
    }
    else if (row.activityStateCode == 6) {
      console.log(row);
      if (row.hasChildActivity == 1) {
        this.service.getLocationByRouteProfile("location", row.routeProfileCode).subscribe(data => {
          this.locations = <Location[]>data.body.records;
          let i = 0;
          for (let location of this.locations) {
            this.marker(i ,location.longitude, location.latitude);
            i = i + 1;
          }

          this.vectorSource.getFeatureById(row.userAlias) ? 
            this.vectorLayer.animateFeature(this.vectorSource.getFeatureById(row.userAlias), 
            [	new ol.featureAnimation['Zoom'](
              {	speed: Number(1.5),
                duration: Number(1000 - 1.5 * 300)
              }),
              new ol.featureAnimation['Bounce'](
              {	speed: Number(1.5), 
                duration: Number(1000 - 1.5 * 300),
                horizontal: /Slide/.test('Zoom')
              })
            ]) : null;
            this.animateSubActivity(row);
        });
      }
      else {
        this.service.getLocationByRouteProfile("location", row.routeProfileCode).subscribe(data => {
          this.locations = <Location[]>data.body.records;
          let i = 0;
          for (let location of this.locations) {
            this.marker(i ,location.longitude, location.latitude);
            i = i + 1;
          }

          this.vectorSource.getFeatureById(row.userAlias) ? 
            this.vectorLayer.animateFeature(this.vectorSource.getFeatureById(row.userAlias), 
            [	new ol.featureAnimation['Zoom'](
              {	speed: Number(1.5),
                duration: Number(1000 - 1.5 * 300)
              }),
              new ol.featureAnimation['Bounce'](
              {	speed: Number(1.5), 
                duration: Number(1000 - 1.5 * 300),
                horizontal: /Slide/.test('Zoom')
              })
            ]) : null;
        });
      }
    }
    else if (row.activityStateCode == 7) {
      this.drawRoute(row);
    }
  }

  /*cleanDemo() {
    this.dropRoute(row);
  }*/

  marker(index, lo, la) {
    const markerStyle = [new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 0.7],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        scale: 0.14,
        src: index > 0 && index < this.locations.length - 1 ? 'assets/node.png' : index == 0 ? 'assets/marker_start.png' : 'assets/marker_finish.png'
      }))
    }),];

    var marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lo, la])),
    });
    marker.setStyle(markerStyle);
    //marker.setId(track.alias);
    this.route.push(marker);
    this.vectorSource.addFeature(marker);
    
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
    });
    this.map.addLayer(this.vectorLayer);

    this.vectorLayer.animateFeature(marker, 
      [	new ol.featureAnimation['Zoom'](
        {	speed: Number(1.5),
          duration: Number(1000 - 1.5 * 300)
        }),
        new ol.featureAnimation['Bounce'](
        {	speed: Number(1.5), 
          duration: Number(1000 - 1.5 * 300),
          horizontal: /Slide/.test('Zoom')
        })
      ]);

    var extent = this.vectorLayer.getSource().getExtent();
    this.map.getView().fit(extent, {size: this.map.getSize(), padding: [150, 50, 150, 50], maxZoom: 13});
  }

  refreshTable() {
    this.getTable();
  }
}