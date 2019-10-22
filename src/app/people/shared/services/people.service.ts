import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, BehaviorSubject, from } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Person, ApiPeople } from '../../create/person';


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
  peopleUrl: string = environment.baseUrl + '/people';
  getPeople(): Observable<Person[]> {
    return this.http.get<ApiPeople>(`${this.peopleUrl}`).pipe(
      map((res: ApiPeople) => {
        return res.data;
      })
    );
  }
  getPeopleSorted(order, type): Observable<Person[]> {
    const url = this.peopleUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<ApiPeople>(`${url}`, { params }).pipe(
      map((res: ApiPeople) => {
        return res.data;
      })
    );
  }

  editPerson(person: any): Observable<any> {
    const url = `${this.peopleUrl}/${person.id}`;
    return this.http.put(url, person, httpOptions);
  }

  deletePerson(person: any) {
    const url = `${this.peopleUrl}/${person.id}`;
    return this.http.delete(url, httpOptions);
  }

  addPerson(person: any) {
    const url = `${this.peopleUrl}`;
    console.log(person);

    return this.http.post<Person>(url, person, httpOptions);
  }
  getPerson(person: Person): Observable<Person[]> {
    return this.http.get<ApiPeople>(`${this.peopleUrl}/${person.id}`).pipe(
      map((res: ApiPeople) => {
      return res.data;
    }));
  }
}
