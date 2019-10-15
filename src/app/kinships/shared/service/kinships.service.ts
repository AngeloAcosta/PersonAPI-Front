import { environment } from './../../../../environments/environment';
import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers : new HttpHeaders({
    'Content-type' : 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class KinshipsService{
  constructor(private http: HttpClient){ }
  baseUrl: string = environment.baseUrl;

  getKinship(): Observable<any>{
    return this.http.get<any[]>(`${this.baseUrl}`).pipe();
  }

  getKinshipsSorted(order, type): Observable<any>{
    const url = this.baseUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<any[]>(`${url}`,{params}).pipe();
  }
}
