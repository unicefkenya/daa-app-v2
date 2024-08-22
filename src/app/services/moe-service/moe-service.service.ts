import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { CommonService } from '../common-services/common.service';

@Injectable({
  providedIn: 'root'
})
export class MoeService {
  constructor(public http: HttpClient, public storage: Storage, public commonService: CommonService) {

  }



  getStates(): any {
    return this.http.get<any>(`${this.commonService.apiURL}/api/v1/moe/states`);
  }

  getDistricts(id) {
    return this.http.get<any>(`${this.commonService.apiURL}/api/v1/moe/districts?id=${id}`);
  }

  getRegions() {
    return this.http.get<any>(`${this.commonService.apiURL}/api/v1/moe/regions`)
  }

  getBloodGroups() {
    return this.http.get<any>(`${this.commonService.apiURL}/api/v1/moe/blood-groups`);
  }

  getSections() {

    return this.http.get<any>(`${this.commonService.apiURL}/api/v1/moe/sections`)

  }
}
