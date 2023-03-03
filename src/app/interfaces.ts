export interface Response {
  body: Table;
  code: number;
  error: boolean;
}

export interface Table {
  records: object[];
  recordsFound: number;
}

export interface Provider {
  code : number;
  name : string;
}

export interface Session {
  alias : string;
  name : string;
  contactPhoneNumber: string;
  providerCode : number;
  userRoleCode : number;
}

export interface User extends Session {
  hash : string;
  salt : string;
}

export interface Credential extends Session {
  password : string;
}

export interface Activity {
  code : number;
  customerCode: number;
  serviceCode: number;
  serviceServiceTypeCode: number;
  activityStateCode: number;
  routeProfileCode: number;
  userAlias: string;
  userProviderCode: number;
  activityCode: number;
  activityCustomerCode: number;
  activityServiceCode: number;
  locationCode: number,
  locationLocationTypeCode: number,
  activityServiceServiceTypeCode: number;
  cancellationReasonCode: number;
  scheduledDate: number;
  passengerName: number;
  passengersNumber: number;
  remark : string;
  checkIn: number;
  checkOut: number;
  hasChildActivity: number;
}

export interface Customer {
  code: number,
  documentCode: string,
  name: string
}

export interface ServiceType {
  code : number;
  name : string;
}

export interface Service {
  code : number;
  serviceTypeCode: number;
  name : string;
}

export interface ActivityState {
  code : number;
  name : string;
}

export interface RouteProfile {
  code : number;
  name : string;
  description: string;
}

export interface Location {
  code : number;
  locationTypeCode: number;
  address : string;
  latitude: number;
  longitude: number;
}

export interface RouteProfileLocation {
  routeProfileCode : number;
  locationCode: number;
  locationLocationTypeCode: number;
  order: number;
}

export interface LocationType {
  code : number;
  name : string;
}

export interface CancellationReason {
  code : number;
  name : string;
}

export interface UserRole {
  code : number;
  name : string;
}

export interface Track {
  order: number;
  activityCode: number;
  activityCustomerCode: number;
  activityServiceCode: number;
  activityServiceServiceTypeCode: number;
  latitude: number;
  longitude: number;
}

export interface DeviceLocation {
  session: object;
  activityHeader: object;
  isSessionActive: boolean;
  activityStateChanged: boolean;
  longitude: number;
  latitude: number;
  code: number;
  customerCode: number;
  serviceCode: number;
  serviceServiceTypeCode: number;
  activityCode: number;
  activityCustomerCode: number;
  activityServiceCode: number;
  activityServiceServiceTypeCode: number;
  activityStateCode: number;
}

export interface ActivityHeader {
  code: number;
  customerCode: number;
  serviceCode: number;
  serviceServiceTypeCode: number;
  activityCode: number;
  activityCustomerCode: number;
  activityServiceCode: number;
  activityServiceServiceTypeCode: number;
  activityStateCode: number;
}

export interface DecodeToken {
  auth: Session,
  exp: number,
  iat: number,
  iss: string
}
/*---------------------------------------------------------------------------*/ 

export interface Audit {
  createdBy: string;
  creationDate: number;
  modifiedBy: string;
  updateDate: number;
}
  
  