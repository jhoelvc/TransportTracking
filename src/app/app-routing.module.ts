import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ActivityComponent } from './maintenance/activity/activity.component';
import { RouteProfileLocationComponent } from './maintenance/routeProfileLocation/routeProfileLocation.component';
import { UserRoleComponent } from './maintenance/user-role/user.role.component';
import { ProviderComponent } from './maintenance/provider/provider.component';
import { UserComponent } from './maintenance/user/user.component';
import { TrackingComponent } from './tracking/tracking.component';
import { CustomerComponent } from './maintenance/customer/customer.component';
import { ActivityStateComponent } from './maintenance/activity-state/activity.state.component';
import { ServiceTypeComponent } from './maintenance/service-type/service.type.component';
import { LocationTypeComponent } from './maintenance/location-type/location.type.component';
import { CancellationReasonComponent } from './maintenance/cancellation-reason/cancellation.reason.component';
import { ServiceComponent } from './maintenance/service/service.component';

const routes: Routes = [
  { path: "", component: TrackingComponent},
  { path: "login", component: LoginComponent },
  { path: "activity", component: ActivityComponent },
  { path: "routeProfileLocation", component: RouteProfileLocationComponent },
  { path: "userRole", component: UserRoleComponent },
  { path: "provider", component: ProviderComponent },
  { path: "user", component: UserComponent },
  { path: "customer", component: CustomerComponent },
  { path: "activityState", component: ActivityStateComponent },
  { path: "serviceType", component: ServiceTypeComponent },
  { path: "locationType", component: LocationTypeComponent },
  { path: "cancellationReason", component: CancellationReasonComponent },
  { path: "service", component: ServiceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
