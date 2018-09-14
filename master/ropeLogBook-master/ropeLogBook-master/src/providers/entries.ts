import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Entrie } from '../models/entrie';

/*
  Generated class for the Entries provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EntriesService {

  constructor(public http: Http) {
  }

  load(): Observable<Entrie[]> {
    return this.http.get('entries.json')
      .map(res => <Entrie[]>res.json().response.entries);
  }

  loadDetail(index): Observable<Entrie[]> {
    return this.http.get('entries.json')
      .map(res => <Entrie[]>res.json().response.entries[index]);
  }

}
