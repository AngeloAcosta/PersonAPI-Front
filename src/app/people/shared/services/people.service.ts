import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Person } from '../components/person/person';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  baseUrl: string = environment.baseUrl;

  getPeople(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe();
  }

  getPeopleSorted(order, type): Observable<any> {
    const url = this.baseUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<any[]>(`${url}`, { params }).pipe();
  }

  editPerson(person: any, body: any): Observable<any> {
    const url = `${this.baseUrl}/${person.id}`;
    return this.http.put(url, body, httpOptions);
  }

  deletePerson(person: any) {
    const url = `${this.baseUrl}/${person.id}`;
    return this.http.delete(url, httpOptions);
  }

  addPerson(person: any) {
    const url = `${this.baseUrl}`;
    return this.http.post<Person>(this.baseUrl, person, httpOptions);
  }

  getPerson(person: Person) {
    const url = `${this.baseUrl}/${person.id}`;
    return this.http.get<Person>(url, httpOptions);
  }
}
