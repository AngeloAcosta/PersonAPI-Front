import { Injectable } from '@angular/core';
import {HttpClient, HttpParams , HttpHeaders} from '@angular/common/http';
import {Person} from '../components/person/person';
import { Observable, pipe, BehaviorSubject } from 'rxjs';
import { environment } from './../../../../environments/environment';


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

getPeople(sort, order): Observable<Person[]> {
  let params = new HttpParams();
  params = params.append('_sort', sort);
  params = params.append('_order', order);
  return this.http.get<Person[]>(`${this.baseUrl}`,{params}).pipe();
}


editPerson(person: Person): Observable<any> {
  const url = `${this.baseUrl}/${person.id}`; 
  return this.http.put(url, person, httpOptions);
}

deletePerson(person: Person){
 const url = `${this.baseUrl}/${person.id}`;
 return this.http.delete(url, httpOptions); 
}

addPerson(person: Person) {
  
  return this.http.post<Person>(this.baseUrl, person, httpOptions);
}

getPerson(person: Person) {
  const url = `${this.baseUrl}/${person.id}`;
  return this.http.get<Person>(url, httpOptions);
}
}
