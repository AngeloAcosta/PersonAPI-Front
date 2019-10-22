import { Kinship } from 'src/app/models/kinship.model';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { KinshipRelation } from 'src/app/models/kinship.model';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers : new HttpHeaders({
    'Content-type' : 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class KinshipsService {
  constructor(private http: HttpClient) {}
  kinshipsUrl: string = environment.baseUrl + '/kinships';

  getKinship(): Observable<Kinship[]> {
    return this.http.get<Kinship[]>(`${this.kinshipsUrl}`).pipe();
  }
  getKinshipsSorted(order, type): Observable<Kinship[]> {
    const url = this.kinshipsUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<Kinship[]>(`${url}`, { params }).pipe();
  }
  editKinship(kinship: Kinship): Observable<Kinship> {
    const url = `${this.kinshipsUrl}/${kinship.id}`;
    return this.http.put<Kinship>(url, kinship, httpOptions);
  }
  deleteKinship(kinship: any) {
    const url = `${this.kinshipsUrl}/${kinship.id}`;
    return this.http.delete(url, httpOptions);
  }
  addKinship(kinship: KinshipRelation) {
  const url = `${this.kinshipsUrl}`;
  return this.http.post<KinshipRelation>(url, kinship, httpOptions);
}
}
