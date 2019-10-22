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
    return this.http.post<Person>(this.peopleUrl, person, httpOptions);
  }

  getPersonKinships(person: Person): Observable<any[]> {
    const url = `${this.peopleUrl}/${person.id}/kinships`;
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
  getPerson(person: Person): Observable<Person[]> {
    return this.http.get<ApiPeople>(`${this.peopleUrl}/${person.id}`).pipe(
      map((res: ApiPeople) => {
      return res.data;
    }));
  }
}
