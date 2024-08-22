import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

import { CommonService } from '../common-services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public secretKey = '1234erfgv3456yujm09i8uyhgfc09i8uygfc34ertghbn5tyujm';

  constructor(public commonService: CommonService,
    public http: HttpClient,
    public storage: Storage,
    private router: Router) {
  }

  registerUser(data: any): any {
    const newurl = `${this.commonService.apiURL}/api/v1/`;
    const httpOptions = { headers: this.commonService.headers };
    return this.http
      .post(newurl, data, httpOptions);
  }

  login(data: any, user): any {
    const newurl = `${this.commonService.apiURL}/o/token/`;

    const httpOptions = { headers: this.commonService.tokenHeaders };
    return this.http
      .post<any>(newurl, data, httpOptions)
      .pipe(mergeMap(async (res) => {
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), this.secretKey).toString();
        await this.storage.clear()
        await this.storage.set('current_user', encryptedUser);
        console.log("Done clearing.")
        // Saving the token
        return from(this.storage.set('user_token', res)).pipe(map(() => res));
      }))
      .pipe(mergeMap(res => {
        return from(this.storage.set('logged_in', true)).pipe(map(() => res));
      }))
      .pipe(mergeMap(res => this.getSchoolInfo()));
  }

  getCountiesInfo() {
    const newurl = `${this.commonService.apiURL}/api/v1/counties/`;
    return this.http
      .get(newurl)
      .pipe(mergeMap(res => this.storageSaveCounties(res)));
  }
  storageSaveCounties(res) {
    return this.storage.set("counties", res.results);
  }

  getSpecialNeedsInfo() {
    const newurl = `${this.commonService.apiURL}/api/v1/special-needs/`;
    return this.http
      .get(newurl)
      .pipe(mergeMap(res => this.storageSaveSpaecialNeeds(res)));
  }
  storageSaveSpaecialNeeds(res) {
    return this.storage.set("special_needs", res.results);
  }

  getSchoolInfo(): Observable<any> {
    const newurl = `${this.commonService.apiURL}/api/v1/users/teacher/school-info/`;
    return this.http
      .get(newurl)
      .pipe(mergeMap(res => this.saveShoolInfo(res)))
      .pipe(mergeMap(res => this.getCountiesInfo()))
      .pipe(mergeMap(res => this.getSpecialNeedsInfo()));
  }

  saveShoolInfo(data): Observable<any> {
    // const classes = data.streams;
    const streamsInfo = data.streams.map(stream => {
      return {
        school: data.school,
        ...stream,
        male_students: stream.students.filter(st => st.gender === 'M').length,
        female_students: stream.students.filter(st => st.gender === 'F').length
      };
    });
    const students = data.streams.map(stream => stream.students).reduce((a, b) => a.concat(b), []);
    const maleStudents = students.filter(student => student.gender === 'M').length;
    const femaleStudents = students.filter(student => student.gender === 'F').length;
    const schoolOverview = {
      name: data.school_name, classes: data.streams.length, male: maleStudents,
      female: femaleStudents, id: data.school, teachers: data.teachers.length
    };
    /// Prepare the data to be saved....
    const dataToSave = [];
    dataToSave.push({ key: 'teachers', value: data.teachers });
    dataToSave.push({ key: 'classes', value: streamsInfo });
    dataToSave.push({ key: 'overview', value: schoolOverview });

    data.streams.map(stream => {
      dataToSave.push({
        key: `stream_${stream.id}`,
        value: stream
      });
    });

    delete data.streams;
    delete data.teachers;

    dataToSave.push({ key: 'profile', value: data });

    return from(Promise.all(dataToSave.map(dt => {
      return this.storage.set(dt.key, dt.value);
    }))).pipe(map(res => data));
  }

  token_refresh(): any {
    let auth: any;
    this.storage.get('user_token').then(data => { auth = data; });
    const allData = `grant_type=${'refresh_token'}&refresh_token=${auth.refresh_token}&client_id=${this.commonService.clientId}`;
    const newurl = `${this.commonService.apiURL}/o/token/`;
    const httpOptions = { headers: this.commonService.tokenHeaders };
    return this.http
      .post<any>(newurl, allData, httpOptions)
      .pipe((map(async res => {
        res.expiry_time = moment().add(res.expires_in / 3600, 'hours').format();
        await this.storage.remove('user_token');
        await this.storage.set('user_token', res);
        return res;
      }))
        // catchError(error => this.commonService.handleError(error))
      );
  }

  logoutCommons() {
    this.storage.set('logged_out', true);
    this.router.navigateByUrl('');
  }

  logout(token): any {
    if (token) {
      const data = `token=${token.access_token}&client_id=${this.commonService.clientId}`;
      const newurl = `${this.commonService.apiURL}/o/revoke_token/`;
      const httpOptions = { headers: this.commonService.tokenHeaders };
      return this.logoutCommons();
      // return this.http
      //   .post(newurl, data, httpOptions)
      //   .pipe(
      //     map(res => {
      //       this.logoutCommons();
      //       return res;
      //     },
      //     error => {
      //       this.logoutCommons();
      //       return error;
      //     })
      //   );
    } else {
      this.logoutCommons();
      return throwError('credentials');
    }
  }
}

