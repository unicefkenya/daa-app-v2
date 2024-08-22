import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from '../common-services/common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
 
  deletedSubject: BehaviorSubject<string>;

  constructor(private commonService: CommonService, public http: HttpClient) {
    this.deletedSubject = new BehaviorSubject<string>(null);
  }

  deletedObservable(): Observable<string> {
    return this.deletedSubject.asObservable();
  }

  getDropoutProbability(query: string) {
    const newurl = `${this.commonService.apiURL}/api/v1/attendances/`+query; // todo: specify endpoint from backend
    return this.http.get<any>(newurl, { headers: this.commonService.headers })
  }

  getStudentAttendanceSummary(query: string){
    const newurl = `${this.commonService.apiURL}/api/v1/attendances/`+query;
    return this.http.get<any>(newurl, { headers: this.commonService.headers })
  }

}
