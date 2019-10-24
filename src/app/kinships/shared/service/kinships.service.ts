import { ApiKinship, KinshipModel, ApiTryKinship } from 'src/app/models/kinship.model';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { KinshipRelation } from 'src/app/models/kinship.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

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
  peopleUrl: string = environment.baseUrl + '/people';

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
  deleteKinship(kinship: any) {
    const url = `${this.kinshipsUrl}/${kinship.idKinship}`;
    return this.http.delete(url, httpOptions);
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
    return this.http.get<ApiKinship>(`${this.kinshipsUrl}/${kinship.personId}`).pipe(
      map((res: ApiKinship) => {
        return res.data;
      })
    );
  }
}
