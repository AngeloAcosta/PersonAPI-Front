import { environment } from './../../../../environments/environment';

import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class KinshipsService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.baseUrl;

  getKinship(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/kinships`).pipe();
  }
  getKinshipsSorted(order, type): Observable<any> {
    const url = this.baseUrl;
    let params = new HttpParams();
    params = params.append('_sort', order);
    params = params.append('_value', type);
    return this.http.get<any[]>(`${url}`, { params }).pipe();
  }
}
