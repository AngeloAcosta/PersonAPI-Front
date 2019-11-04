import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceResponse, SimpleKinship, SimpleKinshipType } from './services.models';
import { environment } from './../../environments/environment';
import { ServiceProxy } from './services.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KinshipsService {
  constructor(private serviceProxy: ServiceProxy) { }

  private readonly endpointUrl: string = `${environment.baseUrl}/kinships`;

  listKinships(query?: string): Observable<ServiceResponse<SimpleKinship[]>> {
    // Generate request params
    let params = new HttpParams();
    if (query) params = params.append('query', query.toString());
    // Send request
    return this.serviceProxy.sendGetRequest<SimpleKinship[]>(this.endpointUrl, params);
  }

  listKinshipTypes(): Observable<ServiceResponse<SimpleKinshipType[]>> {
    // Send request
    return this.serviceProxy.sendGetRequest<SimpleKinshipType[]>(`${this.endpointUrl}/types`);
  }
}
