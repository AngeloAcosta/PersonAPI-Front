import {
  ApiKinship,
  KinshipModel,
  ApiTryKinship
} from 'src/app/models/kinship.model';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { KinshipRelation } from 'src/app/models/kinship.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { kinshipOptions } from 'src/app/shared/constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class KinshipsService {
  constructor(private http: HttpClient) {}
  kinshipsUrl: string = environment.baseUrl + '/kinships';
  peopleUrl: string = environment.baseUrl + '/people';
  relations: { type: string; value: string }[] = kinshipOptions;

  getKinships(): Observable<KinshipModel[]> {
    return this.http.get<ApiKinship>(`${this.kinshipsUrl}`).pipe(
      map((res: ApiKinship) => {
        return res.data;
      })
    );
  }
  getKinshipsSorted(order, type): Observable<KinshipModel[]> {
    const url = this.kinshipsUrl;
    let params = new HttpParams();
    params = params.append('orderBy', order);
    params = params.append('orderType', type);
    return this.http.get<ApiKinship>(`${url}`, { params }).pipe(
      map((res: ApiKinship) => {
        return res.data;
      })
    );
  }
  editKinship(kinship: KinshipModel): Observable<KinshipModel> {
    const url = `${this.kinshipsUrl}/${kinship.personId}`;
    return this.http.put<KinshipModel>(url, kinship, httpOptions);
  }
  // Transform kinship type name to its id
  getKinshipType(type: string) {
    const response = this.relations.find(relation => relation.type === type);
    return response.value;
  }

  deleteKinship(kinship: KinshipRelation) {
    const url = `${this.peopleUrl}/${kinship.personId}/kinships`;
    const options = {
      ...httpOptions,
      body: {
        relativeId: kinship.relativeId,
        kinshipType: this.getKinshipType(kinship.kinshipType)
      }
    };
    return this.http.delete(url, options);
  }
  addKinship(kinship: KinshipRelation) {
    const url = `${this.peopleUrl}/${kinship.personId}/kinships`;
    return this.http.post<KinshipRelation>(url, kinship, httpOptions);
  }

  tryAddKinship(tryKinship: KinshipRelation) {
    const url = `${this.peopleUrl}/${tryKinship.personId}/kinships/test`;
    return this.http.post<ApiTryKinship>(url, tryKinship, httpOptions).pipe(
      map((res: ApiTryKinship) => {
        return res.data;
      })
    );
  }

  tryEditKinship(tryKinship: KinshipRelation) {
    const url = `${this.kinshipsUrl}/${tryKinship.personId}/kinships/test`;
    return this.http.put<ApiTryKinship>(url, tryKinship, httpOptions).pipe(
      map((res: ApiTryKinship) => {
        return res.data;
      })
    );
  }

  getKinship(kinship: KinshipModel): Observable<KinshipModel[]> {
    return this.http
      .get<ApiKinship>(`${this.kinshipsUrl}/${kinship.personId}`)
      .pipe(
        map((res: ApiKinship) => {
          return res.data;
        })
      );
  }
}
