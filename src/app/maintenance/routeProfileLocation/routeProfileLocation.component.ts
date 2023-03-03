import {Component, OnInit, ViewChild} from '@angular/core';
import { Location, RouteProfileLocation, RouteProfile } from 'src/app/interfaces';
import Translate from 'ol/interaction/Translate';
import { LocationComponent } from '../location/location.component';
import { TransportService } from 'src/app/services/transport.service';
import { MatSnackBar } from '@angular/material';
import { RouteProfileComponent } from '../routeProfile/routeProfile.component';

declare var ol: any;

@Component({
  selector: 'app-routeProfileLocation',
  templateUrl: './routeProfileLocation.component.html',
  styleUrls: ['./routeProfileLocation.component.css'],
})
export class RouteProfileLocationComponent implements OnInit {
  @ViewChild(LocationComponent) locationComponent;
  @ViewChild(RouteProfileComponent) routeProfileComponent;
  map =  new ol.Map();
  vectorLayer = new ol.layer.Vector({});
  vectorSource = new ol.source.Vector({});
  popup = new ol.Overlay({});
  view = new ol.View({});

  constructor(public service: TransportService, private snackBar: MatSnackBar) {}

  routeProfile: RouteProfile = {code: 0, name: '', description: ''};
  location: Location = {code: 0, locationTypeCode: 0, address: '', latitude: 0, longitude: 0};
  rProfileLocation: RouteProfileLocation = {routeProfileCode: 0, locationCode: 0, locationLocationTypeCode: 0, order: 0};
  locations: Location[] = [];
  auxlocations: any[] = [];
  rProfileLocations: RouteProfileLocation[] = [];
  locationCode = 0;
  name = '';
  description = '';
  address = '';
  locationTypeCode = 1;
  latitude: number = -13.51678;
  longitude: number = -71.97881;
  coordinate: number[] = [-71.97881, -13.51678];
  routeProfileEdit = false;
  locationEdit = false;
  edit = false;

  ngOnInit() {
    this.drawMap();
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

  receiveMessage(n, $event) {
    this.edit = true;
    if (n == 1) {
      if((<RouteProfile>$event).code > 0) {
        this.routeProfileEdit = true;
        this.routeProfile = <RouteProfile>$event;
        this.name = this.routeProfile.name;
        this.description = this.routeProfile.description;
        this.service.getLocationByRouteProfile("location", this.routeProfile.code).subscribe(data => {
            this.locations = <Location[]>data.body.records;
            let i = 0;
            for (let location of this.locations) {
              //this.locationComponent.routeLocationRef(location);
              this.addMarker(i, location.longitude, location.latitude);
              i = i + 1;
            }
            var extent = this.vectorLayer.getSource().getExtent();
            this.map.getView().fit(extent, {size: this.map.getSize(), padding: [150, 50, 150, 50], maxZoom: 17});

            this.service.getCustomRouteProfileLocation("route-profile-location", "/1/" + this.routeProfile.code + "/0/0/0/0/0/0/1/100").subscribe(data => {
              this.rProfileLocations = <RouteProfileLocation[]>data.body.records;
              const dataSource = data.body.records.map(item => {
                const container: any = {};
                container.code = (<RouteProfileLocation>item).locationCode;
                container.locationTypeCode = (<RouteProfileLocation>item).locationLocationTypeCode;
                container.order = (<RouteProfileLocation>item).order;
                for (let location of this.locations) {
                  if (location.code == (<RouteProfileLocation>item).locationCode && location.locationTypeCode == (<RouteProfileLocation>item).locationLocationTypeCode) {
                    container.address = location.address;
                    container.longitude = location.longitude;
                    container.latitude = location.latitude;
                  }
                }
                return container;
              });
              this.auxlocations = dataSource;
              this.locationComponent.rpLocations = this.auxlocations;
              this.locationComponent.routeLocationRef();
            });
          });
      }
      else if ((<RouteProfile>$event).code == 0) {
        this.routeProfileEdit = true;
        //this.routeProfile.code = 0;
        this.routeProfile = {code: 0, name: '', description: ''};
        this.name = '';
        this.description = '';
      }
    }
    else {
      if((<Location>$event).code > 0) {
        
        this.locationEdit = true;
        this.location = <Location>$event;
        this.locationCode = this.location.code;
        this.locationTypeCode = this.location.locationTypeCode;
        this.longitude = this.location.longitude;
        this.latitude = this.location.latitude;
        this.address = this.location.address;
        this.addMarker(0, this.longitude, this.latitude);
      }
      else if ((<Location>$event).code == 0) {
        this.locationEdit = true;
        this.location.longitude = this.coordinate[0];
        this.location.latitude = this.coordinate[1];
        this.locationTypeCode = 1;
        this.locationCode = 0;
        this.longitude = this.coordinate[0];
        this.latitude = this.coordinate[1];
        this.address = '';
        this.addMarker(0, this.coordinate[0], this.coordinate[1]);
      }
      else if ((<Location>$event).code < 0) {
        let a = false;
        if (this.vectorSource.getFeatures().length > 0) {
          for (let location of this.auxlocations) {
            if (location.longitude == (<Location>$event).longitude && location.latitude == (<Location>$event).latitude) {
              a = true;
              for (let source of this.vectorSource.getFeatures()) {
                if (source.values_.geometry.flatCoordinates[0] == ol.proj.fromLonLat([(<Location>$event).longitude, (<Location>$event).latitude])[0] &&
                source.values_.geometry.flatCoordinates[1] == ol.proj.fromLonLat([(<Location>$event).longitude, (<Location>$event).latitude])[1]) {
                  this.vectorSource.removeFeature(source);
                }
              }
              this.auxlocations.splice(this.auxlocations.indexOf(location), 1);
            }
          }
          if (!a) {
            this.auxlocations.push($event);
            this.locationComponent.rpLocations = this.auxlocations;
            this.addMarker(0, (<Location>$event).longitude, (<Location>$event).latitude);
          }
        }
        else {
          this.auxlocations.push($event);
          this.locationComponent.rpLocations = this.auxlocations;
          this.addMarker(0, (<Location>$event).longitude, (<Location>$event).latitude);
        }
      }
    }    
  }

  receiveEndMessage(n, $event) {
    //console.log($event);
    this.edit = false;
    if (n == 1) {
      this.routeProfileEdit = false;
      this.vectorSource.clear();
      if ($event > 0) {
        this.routeProfileComponent.refreshTable();
        //this.locationComponent.refreshTable();
        this.rProfileLocation.routeProfileCode = $event;

        for (let i = 0; i < this.rProfileLocations.length; i++) {
          let exist = false;
          for (let j = 0; j < this.auxlocations.length; j++) {
            if (this.rProfileLocations[i].locationCode == (this.auxlocations[j].code < 0 ? this.auxlocations[j].code * -1 : this.auxlocations[j].code) && 
              this.rProfileLocations[i].locationLocationTypeCode == this.auxlocations[j].locationTypeCode) {
              exist = true;
              if (i != j) {
                this.rProfileLocation.locationCode = this.rProfileLocations[i].locationCode;
                this.rProfileLocation.locationLocationTypeCode = this.rProfileLocations[i].locationLocationTypeCode;
                this.rProfileLocation.order = j + 1;
                console.log("put: " + this.rProfileLocation.locationCode + "-" + this.rProfileLocation.locationLocationTypeCode + "-" + this.rProfileLocation.order);
                this.service.putRouteProfileLocation("route-profile-location", this.rProfileLocation).subscribe(data => {
                  if (data.error) {
                    this.snackBar.open("No se pudo actualizar.", "Error", {
                      duration: 3000,
                    });
                    console.log(data.body);
                  }
                  else {}
                });
              }
              break;
            }
          }

          if (!exist) {
            this.rProfileLocation.locationCode = this.rProfileLocations[i].locationCode;
            this.rProfileLocation.locationLocationTypeCode = this.rProfileLocations[i].locationLocationTypeCode;
            this.service.deleteRouteProfileLocation("route-profile-location", this.rProfileLocation).subscribe(data => {
              if (data.error) {
                this.snackBar.open("No se pudo actualizar.", "Error", {
                  duration: 3000,
                });
                console.log(data.body);
              }
              else {/*this.locationComponent.refreshTable();*/}
            });
          }
        }

        for (let j = 0; j < this.auxlocations.length; j++) {
          let exist = false;
          for (let i = 0; i < this.rProfileLocations.length; i++) {
            if (this.rProfileLocations[i].locationCode == (this.auxlocations[j].code < 0 ? this.auxlocations[j].code * -1 : this.auxlocations[j].code) && 
              this.rProfileLocations[i].locationLocationTypeCode == this.auxlocations[j].locationTypeCode) {
              exist = true;
              break;
            }
          }

          if (!exist) {
            this.rProfileLocation.locationCode = this.auxlocations[j].code < 0 ? this.auxlocations[j].code * -1 : this.auxlocations[j].code;
            this.rProfileLocation.locationLocationTypeCode = this.auxlocations[j].locationTypeCode;
            this.rProfileLocation.order = j + 1;
            console.log("post: " + this.rProfileLocation.locationCode + "-" + this.rProfileLocation.locationLocationTypeCode + "-" + this.rProfileLocation.order);
            this.service.postRouteProfileLocation("route-profile-location", this.rProfileLocation).subscribe(data => {
              if (data.error) {
                this.snackBar.open("No se pudo actualizar.", "Error", {
                  duration: 3000,
                });
                console.log(data.body);
              }
              else {/*this.locationComponent.refreshTable();*/}
            });
          }
        }
        this.locationComponent.refreshTable();
        this.auxlocations = [];
        this.locations = [];
      }
      else if ($event < 0) {
        this.routeProfileComponent.refreshTable();
        //this.locationComponent.refreshTable();
        this.rProfileLocation.routeProfileCode = $event * -1;
        var order = 1;
        for (let location of this.auxlocations) {
          this.rProfileLocation.locationCode = location.code * -1;
          this.rProfileLocation.locationLocationTypeCode = location.locationTypeCode;
          this.rProfileLocation.order = order++;
          this.service.postRouteProfileLocation("route-profile-location", this.rProfileLocation).subscribe(data => {
            if (data.error) {
              this.snackBar.open("No se pudo crear la ruta", "Error", {
                duration: 3000,
              });
              console.log(data.body);
            }
          });
        }
        this.auxlocations = [];
        this.locations = [];
        this.locationComponent.rpLocations = [];
        this.locationComponent.refreshTable();
      }
      else if ($event == 0) {
        this.locations = [];
        this.auxlocations = [];
        this.locationComponent.rpLocations = [];
        this.locationComponent.refreshTable();
      }
    }
    else {
      this.locationEdit = false;
      this.vectorSource.clear();
      this.popup.setPosition(undefined);
      this.locationComponent.refreshTable();
      //$event == 1 ? this.locationComponent.refreshTable() : null;
    }
  }

  addMarker(index: number, lo: number, la: number) {
    console.log(index);
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lo, la]))
    });

    const markerStyle = [new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 0.7],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        scale: 0.14,
        src: index > 0 && index < this.locations.length - 1 ? 'assets/node.png' : index == 0 ? 'assets/marker_start.png' : 'assets/marker_finish.png'
      })),
    }),];

    marker.setStyle(markerStyle);
    this.vectorSource.addFeature(marker);

    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      //style: markerStyle
    });
    //this.map.addLayer(this.vectorLayer);
    
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

    var translate = new ol.interaction.Translate({
      features: new ol.Collection([marker])
    });

    this.popup = new ol.Overlay({
      id: 1,
      element: document.getElementById("popup"),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    
    this.map.addOverlay(this.popup);
    this.locationEdit ? this.popup.setPosition(ol.proj.fromLonLat([lo, la])) : null;

    this.locationEdit ? this.map.addInteraction(translate) : null;
    this.map.addLayer(this.vectorLayer);
    this.locationEdit ? this.map.setView(new ol.View({center: ol.proj.fromLonLat([lo, la]), zoom: 17})) : null;
    this.routeProfileEdit ? this.map.setView(new ol.View({center: ol.proj.fromLonLat([this.longitude, this.latitude]), zoom: 14})) : null;

    translate.on('translateend', (event: Translate.Event) => {
      const coordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.longitude = coordinate[0];
      this.latitude = coordinate[1];
      marker.setGeometry(new ol.geom.Point(event.coordinate));
      this.popup.setPosition(undefined);
      this.map.setView(new ol.View({center: ol.proj.fromLonLat([coordinate[0], coordinate[1]]), zoom: 17}));
    });

    translate.on('translatestart', (event: Translate.Event) => {
      this.popup.setPosition(undefined);
    });
  }
}