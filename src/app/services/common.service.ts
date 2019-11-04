import { Injectable } from '@angular/core';
import { ServiceResponse, SimpleContactType, SimpleCountry, SimpleDocumentType, SimpleGender } from './services.models';
import { StorageService } from './storage.service';
import { environment } from './../../environments/environment';
import { Observable, of } from 'rxjs';
import { ServiceProxy } from './services.utils';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private serviceProxy: ServiceProxy, private storageService: StorageService) { }

  private readonly contactTypesEndpointUrl: string = `${environment.baseUrl}/contact_types`;
  private readonly countriesEndpointUrl: string = `${environment.baseUrl}/countries`;
  private readonly documentTypesEndpointUrl: string = `${environment.baseUrl}/document_types`;
  private readonly gendersEndpointUrl: string = `${environment.baseUrl}/genders`;

  listContactTypes(): Observable<ServiceResponse<SimpleContactType[]>> {
    // Try to get saved data from storage
    const storageKey = 'listContactTypes';
    const storageValue = this.storageService.getValue<ServiceResponse<SimpleContactType[]>>(storageKey);
    // If data could be retrieved, return it
    if (storageValue) {
      return of(storageValue);
    }
    // Else, send a request
    else {
      const request = this.serviceProxy.sendGetRequest<SimpleContactType[]>(this.contactTypesEndpointUrl);
      // If the response was successful, save it in the storage
      request.subscribe(response => {
        if (response.ok) {
          this.storageService.setValue<ServiceResponse<SimpleContactType[]>>(storageKey, response);
        }
      });
      // Return the request
      return request;
    }
  }

  listCountries(): Observable<ServiceResponse<SimpleCountry[]>> {
    // Try to get saved data from storage
    const storageKey = 'listCountries';
    const storageValue = this.storageService.getValue<ServiceResponse<SimpleCountry[]>>(storageKey);
    // If data could be retrieved, return it
    if (storageValue) {
      return of(storageValue);
    }
    // Else, send a request
    else {
      const request = this.serviceProxy.sendGetRequest<SimpleCountry[]>(this.countriesEndpointUrl);
      // If the response was successful, save it in the storage
      request.subscribe(response => {
        if (response.ok) {
          this.storageService.setValue<ServiceResponse<SimpleCountry[]>>(storageKey, response);
        }
      });
      // Return the request
      return request;
    }
  }

  listDocumentTypes(): Observable<ServiceResponse<SimpleDocumentType[]>> {
    // Try to get saved data from storage
    const storageKey = 'listDocumentTypes';
    const storageValue = this.storageService.getValue<ServiceResponse<SimpleDocumentType[]>>(storageKey);
    // If data could be retrieved, return it
    if (storageValue) {
      return of(storageValue);
    }
    // Else, send a request
    else {
      const request = this.serviceProxy.sendGetRequest<SimpleDocumentType[]>(this.documentTypesEndpointUrl);
      // If the response was successful, save it in the storage
      request.subscribe(response => {
        if (response.ok) {
          this.storageService.setValue<ServiceResponse<SimpleDocumentType[]>>(storageKey, response);
        }
      });
      // Return the request
      return request;
    }
  }

  listGenders(): Observable<ServiceResponse<SimpleGender[]>> {
    // Try to get saved data from storage
    const storageKey = 'listGenders';
    const storageValue = this.storageService.getValue<ServiceResponse<SimpleGender[]>>(storageKey);
    // If data could be retrieved, return it
    if (storageValue) {
      return of(storageValue);
    }
    // Else, send a request
    else {
      const request = this.serviceProxy.sendGetRequest<SimpleGender[]>(this.gendersEndpointUrl);
      // If the response was successful, save it in the storage
      request.subscribe(response => {
        if (response.ok) {
          this.storageService.setValue<ServiceResponse<SimpleGender[]>>(storageKey, response);
        }
      });
      // Return the request
      return request;
    }
  }
}
