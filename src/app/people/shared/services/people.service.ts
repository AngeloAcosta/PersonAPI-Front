import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Person} from '../components/person/person';
import { Observable } from 'rxjs';

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
url: string = 'https://jsonplaceholder.typicode.com/todos';
getPeople(): Observable<Person[]>{
  return this.http.get<Person[]>(this.url);
}

editPerson(person: Person): Observable<any> {
  const url = `${this.url}/${person.id}`;
  return this.http.put(url, person, httpOptions);
}

deleteTodo(person: Person){
 const url = `${this.url}/${person.id}`;
 return this.http.delete(url, httpOptions);
}

addPerson(person: Person) {
  return this.http.post<Person>(this.url, person, httpOptions);
}

getPerson(person: Person) {
  const url = `${this.url}/${person.id}`;
  return this.http.get<Person>(url, httpOptions);
}
}
