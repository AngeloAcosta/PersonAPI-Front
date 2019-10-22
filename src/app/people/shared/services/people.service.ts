

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, BehaviorSubject, from } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Person, ApiPeople, ApiPerson } from '../../create/person';

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

  getPeople(): Observable<Person[]> {
    return this.http.get<ApiPeople>(`${this.baseUrl}/people`).pipe(
      map((res: ApiPeople) => {
        return res.data;
      })
    );
  }

  getPeopleSorted(order, type): Observable<Person[]> {
    const url = this.baseUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<ApiPeople>(`${url}/people`, { params }).pipe(
      map((res: ApiPeople) => {
        return res.data;
      })
    );
  }

  editPerson(person: Person): Observable<Person> {
    const url = `${this.baseUrl}/people/${person.id}`;
    return this.http.put<Person>(url, person, httpOptions);
  }

  deletePerson(person: any) {
    const url = `${this.baseUrl}/people/${person.id}`;
    return this.http.delete(url, httpOptions);
  }

  addPerson(person: any) {
    const url = `${this.baseUrl}`;
    return this.http.post<Person>(this.baseUrl, person, httpOptions);
  }

  getPersonKinships(person: Person): Observable<any[]> {
    const url = `${this.baseUrl}/${person.id}/kinships`;
    const kinships = [
      {
        id:"1",
        namePerson:"Hardi",
        lastNamePerson:"Manrique",
        documentPerson: "76192501",
        kinshipType: "Mother",
        nameRelative: "Fanny",
        lastNameRelative: "Hurtado",
        documentRelative: "76192503"
      },
      {
        id:"2",
        namePerson:"Hardi",
        lastNamePerson:"Manrique",
        documentPerson: "76192501",
        kinshipType: "Father",
        nameRelative: "Hardi",
        lastNameRelative: "Manrique",
        documentRelative: "76192502"
      },
      {
        id:"3",
        namePerson:"Hardi",
        lastNamePerson:"Manrique",
        documentPerson: "76192501",
        kinshipType: "Brother",
        nameRelative: "Gabriel",
        lastNameRelative: "Manrique",
        documentRelative: "76192504"
      },
      // {
      //   id:"4",
      //   namePerson:"Camila",
      //   lastNamePerson:"Urquizo",
      //   documentPerson: "12345678",
      //   kinshipType: "Sister",
      //   nameRelative: "Carla",
      //   lastNameRelative: "Urquizo",
      //   documentRelative: "87654321"
      // }
    ]
    //return this.http.get<any[]>(url, httpOptions);
    return new Observable(o =>{
      o.next(kinships);
    });
  }

  /*getPerson(person: Person) {
    const url = `${this.baseUrl}/${person.id}`;
    return this.http.get<Person>(url, httpOptions);
  }*/

  getPerson(person: Person): Observable<Person> {
    return this.http.get<ApiPerson>(`${this.baseUrl}/people/${person.id}`).pipe(
      map((res: ApiPerson) => {
      return res.data;
    }));
  }
}
