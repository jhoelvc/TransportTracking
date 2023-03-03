import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceLocation } from '../interfaces';
import { webSocket } from 'rxjs/webSocket';

const URL = "wss://190.117.75.72:8181/Transport/echo/device-location?";
//const URL = 'wss://192.168.0.14:8181/Transport/echo/device-location?';

const wsSubject = webSocket({
  url: URL + localStorage.getItem("accessToken"),
  serializer: msg => JSON.stringify(msg),
  openObserver: {
    next: () => {
        console.log('connetion ok');
    }
},
  closeObserver: {
      next(closeEvent) {
          const customError = { code: 6666, reason: "Custom evil reason" }
          console.log(`code: ${customError.code}, reason: ${customError.reason}`);
      }
  }
});

@Injectable()
export class TrackService {

  public messages;

  constructor(wsService: WebsocketService) {
    this.messages = wsSubject;
    /*this.messages = <Subject<DeviceLocation>>wsService.connect(URL + localStorage.getItem("accessToken")).pipe(map(
      (response: MessageEvent): DeviceLocation => {
        let data = JSON.parse(response.data);
        //console.log(data)
        return {
          session: data.session,
          activityHeader: data.activityHeader,
          isSessionActive: data.isSessionActive,
          activityStateChanged: data.activityStateChanged,
          longitude: data.longitude,
          latitude: data.latitude
        };
      }
    ))*/
  }
}