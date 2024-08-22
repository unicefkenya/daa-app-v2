import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

import { CommonService } from '../common-services/common.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  MySchoolSubject: BehaviorSubject<string>;
  constructor(public commonService: CommonService,
    public http: HttpClient,
    public storage: Storage) { }

  getSchool() {
    const newurl = `${this.commonService.apiURL}/api/v1/`;
    return this.http
      .get<any>(newurl, { headers: this.commonService.headers })
      .pipe(mergeMap(async school => {
        let allBoys = 0;
        let allGirls = 0;
        let allClasses = 0;
        await school.streams.map(async stream => {
          allBoys += await (stream.students.filter(gender => gender.gender === 'MALE').length);
          allGirls += await (stream.students.filter(gender => gender.gender === 'FEMALE').length);
          allClasses += allClasses;
          await this.storage.set(`stream_${stream.id}_detailed`, stream);
        });
        const overview = { boys: allBoys, girls: allGirls, name: school.name, classes: allClasses, teachers: school.teachers.length };
        await this.storage.set('overview', overview);
        await this.storage.set(`teachers`, school.teachers);
      }));
  }

}
