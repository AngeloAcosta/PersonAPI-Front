import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePerson, ModifyPerson, OrderBy, OrderType, ServiceResponse, SimpleKinship, SimplePerson, CreateKinship, ModifyKinship, TestKinship } from './services.models';
import { environment } from './../../environments/environment';
import { ServiceProxy } from './services.utils';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  constructor(private serviceProxy: ServiceProxy) { }

  private readonly endpointUrl: string = `${environment.baseUrl}/people`;

  createKinship(personId: number, kinship: CreateKinship): Observable<ServiceResponse<any>> {
    // Send request
    return this.serviceProxy.sendPostRequest<any>(`${this.endpointUrl}/${personId}/kinships`, kinship);
  }

  createKinshipTest(personId: number, kinship: CreateKinship): Observable<ServiceResponse<TestKinship>> {
    // Send request
    return this.serviceProxy.sendPostRequest<TestKinship>(`${this.endpointUrl}/${personId}/kinships/test`, kinship);
  }

  createPerson(person: CreatePerson): Observable<ServiceResponse<SimplePerson>> {
    // Send request
    return this.serviceProxy.sendPostRequest<SimplePerson>(this.endpointUrl, person);
  }

  deleteKinship(personId: number, relativeId: number): Observable<ServiceResponse<any>> {
    // Send request
    return this.serviceProxy.sendDeleteRequest<any>(`${this.endpointUrl}/${personId}/kinships/${relativeId}`);
  }

  deleteKinshipTest(personId: number, relativeId: number): Observable<ServiceResponse<TestKinship>> {
    // Send request
    return this.serviceProxy.sendDeleteRequest<any>(`${this.endpointUrl}/${personId}/kinships/${relativeId}/test`);
  }

  deletePerson(personId: number): Observable<ServiceResponse<any>> {
    // Send request
    return this.serviceProxy.sendDeleteRequest<any>(`${this.endpointUrl}/${personId}`);
  }

  inspectPerson(personId: number): Observable<ServiceResponse<SimplePerson>> {
    // Send request
    return this.serviceProxy.sendGetRequest<SimplePerson>(`${this.endpointUrl}/${personId}`);
  }

  inspectPersonKinships(personId: number): Observable<ServiceResponse<SimpleKinship[]>> {
    // Send request
    return this.serviceProxy.sendGetRequest<SimpleKinship[]>(`${this.endpointUrl}/${personId}/kinships`);
  }

  listPeople(limit?: number, offset?: number, query?: string, orderBy?: OrderBy, orderType?: OrderType): Observable<ServiceResponse<SimplePerson[]>> {
    // Generate request params
    let params = new HttpParams();
    if (limit) params = params.append('limit', limit.toString());
    if (offset) params = params.append('offset', offset.toString());
    if (query) params = params.append('query', query.toString());
    if (orderBy) params = params.append('orderBy', orderBy.toString());
    if (orderType) params = params.append('orderType', orderType.toString());
    // Send request
    return this.serviceProxy.sendGetRequest<SimplePerson[]>(this.endpointUrl, params);
  }

  modifyKinship(personId: number, relativeId: number, kinship: ModifyKinship): Observable<ServiceResponse<any>> {
    // Send request
    return this.serviceProxy.sendPutRequest<any>(`${this.endpointUrl}/${personId}/kinships/${relativeId}`, kinship);
  }

  modifyKinshipTest(personId: number, relativeId: number, kinship: ModifyKinship): Observable<ServiceResponse<TestKinship>> {
    // Send request
    return this.serviceProxy.sendPutRequest<TestKinship>(`${this.endpointUrl}/${personId}/kinships/${relativeId}/test`, kinship);
  }

  modifyPerson(personId: number, person: ModifyPerson): Observable<ServiceResponse<SimplePerson>> {
    // Send request
    return this.serviceProxy.sendPutRequest<SimplePerson>(`${this.endpointUrl}/${personId}`, person);
  }
}
