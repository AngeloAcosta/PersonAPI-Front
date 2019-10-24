import { ApiKinship, KinshipModel } from './../../../models/kinship.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, BehaviorSubject, from } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Kinship } from 'src/app/models/kinship.model';
import { Person, ApiPeople, ApiPerson } from '../../create/create.models';
import { Personedit } from '../../edit/editperson';
import { InspectModel } from '../../inspect/inspect.models';
import { ResponseModel } from '../../../shared/models';

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
  localUrl: string = environment.localBaseUrl + '/people';

  getPeople(): Observable<Person[]> {
    return this.http.get<ApiPeople>(`${this.localUrl}?limit=420`).pipe(
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

  getKinshipSorted(order, type, person): Observable<KinshipModel[]> {
    const url = `${this.peopleUrl}/${person.id}/kinships`;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<ApiKinship>(`${url}`, { params }).pipe(
      map((res: ApiKinship) => {
        return res.data;
      })
    );
  }

  editPerson(person: Personedit): Observable<Personedit> {
    const url = `${this.peopleUrl}/${person.id}`;
    return this.http.put<Personedit>(url, person, httpOptions);
  }

  deletePerson(person: any) {
    const url = `${this.peopleUrl}/${person.id}`;
    return this.http.delete(url, httpOptions);
  }

  addPerson(person: any) {
    const url = `${this.peopleUrl}`;
    return this.http.post<Person>(this.peopleUrl, person, httpOptions);
  }

  getPersonKinships(person: Person): Observable<ApiKinship> {
    const url = `${this.localUrl}/${person.id}/kinships`;
    return this.http.get<KinshipModel>(url, httpOptions).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }


  getPerson(id: number): Observable<ApiPerson> {
    return this.http.get<ResponseModel<ApiPerson>>(`${this.localUrl}/${id}`).pipe(
      map((res: ResponseModel<ApiPerson>) => {
        return res.data;
      })
    );
  }
}
