import { Injectable } from '@angular/core';
import {HttpClient, HttpParams , HttpHeaders} from '@angular/common/http';
import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Person, ApiPerson } from '../../create/person';


const httpOptions = {
  headers : new HttpHeaders({
    'Content-type' : 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PeopleService {
constructor(private http: HttpClient) { }

baseUrl: string = environment.baseUrl;

getPeople(): Observable<Person[]> {
  return this.http.get<ApiPerson>(`${this.baseUrl}`).pipe(
    map((res: ApiPerson) => {
    return res.data;
  }));
}

getPeopleSorted(order, type): Observable<Person[]> {
  const url = this.baseUrl;
  let params = new HttpParams();
  params = params.append('orderBy', order);
  params = params.append('orderType', type);
  return this.http.get<ApiPerson>(`${url}`, {params}).pipe(
    map((res: ApiPerson) => {
      return res.data;
    })
  );
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
  console.log(person);

  return this.http.post<Person>(this.baseUrl, person, httpOptions);
}

getPerson(person: Person) {
  const url = `${this.baseUrl}/${person.id}`;
  return this.http.get<Person>(url, httpOptions);
}
}
