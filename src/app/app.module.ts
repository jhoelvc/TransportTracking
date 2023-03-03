import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

import { MaterialModule } from './material'
import { Interceptor } from './services/interceptor';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { LoginComponent } from './login/login.component';
import { TransportService } from './services/transport.service';
import { ActivityComponent } from './maintenance/activity/activity.component';
import { AddActivityComponent } from './dialogs/activity/add/add.activity.component';
import { RouteProfileLocationComponent } from './maintenance/routeProfileLocation/routeProfileLocation.component';
import { RouteProfileComponent } from './maintenance/routeProfile/routeProfile.component';
import { RouteProfileAddComponent } from './maintenance/routeProfile/add/add.routeProfile.component';
import { LocationComponent } from './maintenance/location/location.component';
import { LocationAddComponent } from './maintenance/location/add/add.location.component';
import { UserRoleComponent } from './maintenance/user-role/user.role.component';
import { UserRoleAddComponent } from './dialogs/user-role/user.role.add.component';
import { UserComponent } from './maintenance/user/user.component';
import { ProviderComponent } from './maintenance/provider/provider.component';
import { ProviderAddComponent } from './dialogs/provider/provider.add.component';
import { DeleteComponent } from './dialogs/delete/delete.component';
import { UserAddComponent } from './dialogs/user/user.add.component';
import { ActivityAssignComponent } from './dialogs/activity-assign/activity.assign.component';
import { TrackingComponent } from './tracking/tracking.component';
import { CustomerComponent } from './maintenance/customer/customer.component';
import { CustomerAddComponent } from './dialogs/customer/customer.add.component';
import { ActivityStateComponent } from './maintenance/activity-state/activity.state.component';
import { ActivityStateAddComponent } from './dialogs/activity-state/activity.state.add.component';
import { ServiceTypeComponent } from './maintenance/service-type/service.type.component';
import { ServiceTypeAddComponent } from './dialogs/service-type/service.type.add.component';
import { LocationTypeComponent } from './maintenance/location-type/location.type.component';
import { LocationTypeAddComponent } from './dialogs/location-type/location.type.add.component';
import { CancellationReasonComponent } from './maintenance/cancellation-reason/cancellation.reason.component';
import { CancellationReasonAddComponent } from './dialogs/cancellation-reason/cancellation.reason.add.component';
import { ServiceComponent } from './maintenance/service/service.component';
import { ServiceAddComponent } from './dialogs/service/service.add.component';
import { ChangePasswordComponent } from './dialogs/changePassword/changePassword.component';

import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-MX';
import { WebsocketService } from './services/websocket.service';
import { TrackService } from './services/track.service';

registerLocaleData(localeEsAR, 'es-Mx');


@NgModule({
  declarations: [
    AppComponent,
    ConfirmationComponent,
    LoginComponent,
    ActivityComponent,
    AddActivityComponent,
    RouteProfileLocationComponent,
    RouteProfileComponent,
    RouteProfileAddComponent,
    LocationComponent,
    LocationAddComponent,
    UserRoleComponent,
    UserRoleAddComponent,
    UserComponent,
    UserAddComponent,
    ProviderComponent,
    ProviderAddComponent,
    ActivityAssignComponent,
    DeleteComponent,
    TrackingComponent,
    CustomerComponent,
    CustomerAddComponent,
    ActivityStateComponent,
    ActivityStateAddComponent,
    ServiceTypeComponent,
    ServiceTypeAddComponent,
    LocationTypeComponent,
    LocationTypeAddComponent,
    CancellationReasonComponent,
    CancellationReasonAddComponent,
    ServiceComponent,
    ServiceAddComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    ConfirmationComponent,
    LoginComponent,
    ActivityComponent,
    AddActivityComponent,
    RouteProfileLocationComponent,
    RouteProfileComponent,
    RouteProfileAddComponent,
    LocationComponent,
    LocationAddComponent,
    UserRoleComponent,
    UserRoleAddComponent,
    UserComponent,
    UserAddComponent,
    ProviderComponent,
    ProviderAddComponent,
    ActivityAssignComponent,
    DeleteComponent,
    TrackingComponent,
    CustomerComponent,
    CustomerAddComponent,
    ActivityStateComponent,
    ActivityStateAddComponent,
    ServiceTypeComponent,
    ServiceTypeAddComponent,
    LocationTypeComponent,
    LocationTypeAddComponent,
    CancellationReasonComponent,
    CancellationReasonAddComponent,
    ServiceComponent,
    ServiceAddComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TransportService,
    WebsocketService,
    TrackService,
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
