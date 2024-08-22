import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { CommonService } from '../common-services/common.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(public commonService: CommonService,
    public http: HttpClient,
    public storage: Storage,
    private router: Router) {

  }

  getStreams() {
    const newurl = `${this.commonService.apiURL}/api/v1/`;
    const classes = [];
    return this.http
      .get<any>(newurl, { headers: this.commonService.headers })
      .pipe(mergeMap(async streams => {
        await Promise.all(streams.map(async stream => {
          await this.storage.set(`stream_${stream.id}`, stream.students);
          classes.push({ name: stream.name, id: stream.id });
        }));
        await this.storage.set('classes', classes);
        await this.getAttendance();
        return streams;
      }),
        catchError(error => { throw error; })
      );
  }

  submitAttendance(data) {
    const newurl = `${this.commonService.apiURL}/api/v1/`;
    return this.http
      .post(newurl, data, { headers: this.commonService.headers });
  }

  getAttendance() {
    const newurl = `${this.commonService.apiURL}/api/v1/`;
    return this.http
      .get<any>(newurl, { headers: this.commonService.headers })
      .pipe(mergeMap(async attendance => {
        attendance.map(async obj => {
          const att = [];
          const stream = await this.storageGetstream(obj.stream);
          await stream.map(student => {
            obj.absent.includes(student.id) ? student.attentance = false : student.attentance = true;
            att.push(student);
          });
          const formatedDate = await String(moment(obj.date).format('YYYY-MM-DD')).split('-').join('_');
          await this.storage.set(formatedDate, att);
        });
      }));
  }

  storageGetstream(id) {
    let data: any;
    // tslint:disable-next-line:no-unused-expression
    async () => {
      await this.storage.get(`stream_${id}`).then(dt => {
        data = dt;
      });
    };
    return data;
  }
}
