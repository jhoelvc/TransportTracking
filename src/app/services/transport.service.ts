import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response, Provider, Service, ServiceType, CancellationReason, Location, RouteProfileLocation,
  Activity, ActivityState, UserRole, RouteProfile, Customer, Credential, LocationType } from '../interfaces';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'accessToken'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  //private url = 'https://192.168.0.14:8181/Transport/api/';
  private url = 'https://190.117.75.72:8181/Transport/api/';

  constructor(private http: HttpClient) { }

  /*-------------USER---------------*/
  loginUser(user: Credential): Observable<any> {
    return this.http.post<any>(this.url + "user/jwt", user, httpOptions).pipe(map(data => data));
  }

  getUser(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/a/0/0/0/0/0/a/0/a/1/100");
  }

  getUserOperator(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/operator");
  }

  getCustomUser(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postUser(table: string, body : Credential): Observable<Response>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putUser(table: string, body : Credential): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.alias + "/" + body.providerCode, body, httpOptions);
  }

  putUserPassword(body: Credential) {
    return this.http.put<Response>(this.url + "user/password/" + body.alias + "/" + body.providerCode, body, httpOptions);
  }

  deleteUser(table: string, body : Credential): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.alias + "/" + body.providerCode);
  }

  /*-------------USER ROLE---------------*/
  getUserRole(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomUserRole(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postUserRole(table: string, body : UserRole): Observable<Response>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putUserRole(table: string, body : UserRole): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteUserRole(table: string, body : UserRole): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------PROVIDER---------------*/
  getProvider(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomProvider(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  getProviderAnonymous(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/anonymous");
  }

  postProvider(table: string, body : Provider): Observable<Response> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putProvider(table: string, body : Provider): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteProvider(table: string, body : Provider): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------ACTIVITY---------------*/
  cancelActivity(table: string, body : Activity): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/cancel/" + body.code + "/" + body.customerCode + "/" + body.serviceCode + "/" + body.serviceServiceTypeCode, body, httpOptions);
  }

  getActivity(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/a/0/0/0/0/0/0/0/0/0/0/0/0/a/0/0/0/a/0/0/0/0/0/0/1/100");
  }

  getActivityReport(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/report" + filter);
  }

  getCustomActivity(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postActivity(table: string, body : Activity): Observable<any> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putActivity(table: string, body : Activity): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code + "/" + body.customerCode + "/" + body.serviceCode + "/" + body.serviceServiceTypeCode, body, httpOptions);
  }

  putActivityAssign(table: string, body : Activity): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/assign/" + body.code + "/" + body.customerCode + "/" + body.serviceCode + "/" + body.serviceServiceTypeCode, body, httpOptions);
  }

  deleteActivity(table: string, body : Activity): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code + "/" + body.customerCode + "/" + body.serviceCode + "/" + body.serviceServiceTypeCode);
  }

  /*-------------CUSTOMER---------------*/
  getCustomer(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/0/a/1/100");
  }

  getCustomCustomer(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postCustomer(table: string, body : Customer): Observable<any> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putCustomer(table: string, body : Customer): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteCustomer(table: string, body : Customer): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------SERVICE TYPE---------------*/
  getServiceType(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomServiceType(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postServiceType(table: string, body : ServiceType): Observable<any> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putServiceType(table: string, body : ServiceType): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteServiceType(table: string, body : ServiceType): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------SERVICE---------------*/
  getService(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/a/1/100");
  }

  getServiceByTypeService(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/1/1/0/a/1/100");
  }

  getCustomService(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postService(table: string, body : Service): Observable<any> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putService(table: string, body : Service): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code + "/" + body.serviceTypeCode, body, httpOptions);
  }

  deleteService(table: string, body : Service): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code + "/" + body.serviceTypeCode);
  }

  /*-------------ACTIVITY STATE---------------*/
  getActivityState(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomActivityState(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postActivityState(table: string, body : ActivityState): Observable<any> {
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putActivityState(table: string, body : ActivityState): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteActivityState(table: string, body : ActivityState): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------ROUTE PROFILE---------------*/
  getRouteProfile(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/0/a/1/100");
  }

  getCustomRouteProfile(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postRouteProfile(table: string, body : RouteProfile): Observable<any>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putRouteProfile(table: string, body : RouteProfile): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteRouteProfile(table: string, body : RouteProfile): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }
  

  /*-------------LOCATION---------------*/
  getLocation(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/a/0/0/0/0/0/0/1/100");
  }

  getCustomLocation(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  getLocationByRouteProfile(table : string, routeCode: number): Observable<Response>{
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/a/0/0/0/0/1/" + routeCode + "/1/100");
  }

  postLocation(table: string, body : Location): Observable<any>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putLocation(table: string, body : Location): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code + "/" + body.locationTypeCode, body, httpOptions);
  }

  deleteLocation(table: string, body : Location): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code + "/" + body.locationTypeCode);
  }

  /*-------------ROUTE PROFILE LOCATION---------------*/
  getRouteProfileLocation(table: string): Observable<Response>{
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/0/0/0/1/100");
  }

  getCustomRouteProfileLocation(table: string, filter: string): Observable<Response>{
    return this.http.get<Response>(this.url + table + filter);
  }

  postRouteProfileLocation(table: string, body : RouteProfileLocation): Observable<any>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putRouteProfileLocation(table: string, body : RouteProfileLocation): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.routeProfileCode + "/" + body.locationCode + "/" + body.locationLocationTypeCode, body, httpOptions);
  }

  deleteRouteProfileLocation(table: string, body : RouteProfileLocation): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.routeProfileCode + "/" + body.locationCode + "/" + body.locationLocationTypeCode);
  }

  /*-------------LOCATION TYPE---------------*/
  getLocationType(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomLocationType(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postLocationType(table: string, body : LocationType): Observable<any>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putLocationType(table: string, body : LocationType): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteLocationType(table: string, body : LocationType): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------CANCELLATION REASON---------------*/
  getCancellationReason(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/a/1/100");
  }

  getCustomCancellationReason(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }

  postCancellationReason(table: string, body : CancellationReason): Observable<any>{
    return this.http.post<Response>(this.url + table, body, httpOptions);
  }

  putCancellationReason(table: string, body : CancellationReason): Observable<Response> {
    return this.http.put<Response>(this.url + table + "/" + body.code, body, httpOptions);
  }

  deleteCancellationReason(table: string, body : CancellationReason): Observable<Response> {
    return this.http.delete<Response>(this.url + table + "/" + body.code);
  }

  /*-------------TRACK---------------*/
  getTrack(table: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + "/0/0/0/0/0/0/0/0/0/0/0/100");
  }

  getCustomTrack(table: string, filter: string): Observable<Response> {
    return this.http.get<Response>(this.url + table + filter);
  }
}
