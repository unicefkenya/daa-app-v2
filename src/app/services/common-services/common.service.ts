import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Events } from './events';
import { environment } from 'src/environments/environment';

export const API_URL = environment.apiUrl;
export const API_CLIENT_ID = environment.clientId;


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public apiURL = API_URL;  // testing url
  public clientId = API_CLIENT_ID;
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public tokenHeaders = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded' });

  isLoading = false;

  constructor(private storage: Storage, public http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
    public events: Events, public loadingCtr: LoadingController, public translateService: TranslateService) { }



  async presentToast(message, duration = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  removeNullFields(data) {
    let newData = {}
    for (let key in data) {
      if (data[key])
        newData[key] = data[key]
    }
    return newData
  }
  // performs all post requests
  generalPost(data: any, url): any {
    const newurl = `${this.apiURL}/api/v1/${url}/`;
    return this.http
      .post(newurl, data);
  }

  // performs all put requests
  generalEdit(data, url) {
    const newurl = `${this.apiURL}/api/v1/${url}/`;
    return this.http
      .put<any>(newurl, data, { headers: this.headers });
  }

  // performs all delete requests
  // todo: change to camel-case generalDelete()
  generalDelete(url) {
    const newurl = `${this.apiURL}/api/v1/${url}`;
    return this.http
      .delete(newurl);
  }

  // performs all get requests
  generalGet(url) {
    const newurl = `${this.apiURL}/api/v1/${url}/`;
    return this.http
      .get<any>(newurl, { headers: this.headers });
  }

  generalFilter(url) {
    const newurl = `${this.apiURL}/api/v1/${url}`;
    return this.http
      .get<any>(newurl, { headers: this.headers });
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(error as T);
    };
  }

  async storageAddStudentToStream(student, storageName) {
    return await this.storage.get(storageName).then(async data => {
      if (data) {
        data.students.push(student);
        await this.storage.set(storageName, data);
      }
    });
  }

  async storageRemoveStudentFromStream(student, storageName) {
    console.log(storageName)
    console.log(student)
    await this.storage.get(storageName).then(async data => {
      const newData = data.students.filter(std => Number(std.id) !== Number(student.id));
      data.students = newData;
      await this.storage.set(storageName, data);
    });
  }

  async storageEditStudentInStream(student, storageName) {
    await this.storage.get(storageName).then(async data => {
      const newData = data.students.filter(std => Number(std.id) !== Number(student.id))
      newData.push(student);
      data.students = newData;
      this.storage.set(storageName, data);
    });
  }

  async storageGetStudent(studentId, classId) {
    return await this.storage.get(`stream_${classId}`).then(async data => {
      const student = data.students.filter(std => Number(std.id) === Number(studentId));
      return student[0];
    });
  }

  async storageBulkMoveStudents(data) {   // data = { to: to_stream_id, from: from_stream_id,. students: 'array_of_students_to_move'}
    const male = data.students.filter(students => students.gender == 'M').length;
    const female = data.students.filter(students => students.gender == 'F').length;
    if (data.to) {
      await this.storage.get(`stream_${data.to}`).then(async stream => {
        try { stream.male_students += male; } catch (error) { stream.male_students = male; }
        try { stream.female_students += female; } catch (error) { stream.female_students = female; }
        stream.students = stream.students.concat(data.students);
        this.storage.set(`stream_${data.to}`, stream);
      });
    }

    if (data.from) {
      await this.storage.get(`stream_${data.from}`).then(async stream => {
        const ids = data.students.map(student => student.id);
        const remaining = stream.students.filter(student => !ids.includes(student.id));
        try { stream.male_students -= male; } catch (error) { stream.male_students = male; }
        try { stream.female_students -= female; } catch (error) { stream.female_students = female; }
        stream.students = remaining;
        this.storage.set(`stream_${data.from}`, stream);
      });
    }
  }

  async storageChangeSchoolOverview(mydata) {   // data = [{action: 'add', F: 2, M: 3}]
    return await this.storage.get('overview').then(async res => {
      await mydata.map(data => {
        if (data.action === 'add') {
          if (data.F) { res.female = Number(res.female) + Number(data.F); }
          if (data.M) { res.male = Number(res.male) + Number(data.M); }
          if (data.teachers) { res.teachers = Number(res.teachers) + Number(data.teachers); }
          if (data.classes) { res.classes = Number(res.classes) + Number(data.classes); }
        }
        if (data.action === 'delete') {
          if (data.F) { res.female = Number(res.female) - Number(data.F); }
          if (data.M) { res.male = Number(res.male) - Number(data.M); }
          if (data.teachers) { res.teachers = Number(res.teachers) - Number(data.teachers); }
          if (data.classes) { res.classes = Number(res.classes) - Number(data.classes); }
        }
      });
      return await this.storage.set('overview', res);
    });
  }

  async storageAddItem(data, name) {
    return await this.storage.get(name).then(items => {
      console.log(items);
      if (items) {
        items.push(data);
        this.storage.set(name, items);
      } else {
        this.storage.set(name, [data]);
      }
    });
  }

  async storageEditItem(data, name) {
    return await this.storage.get(name).then(items => {
      items = items.filter(t => t.id != data.id);
      items.push(data);
      this.storage.set(name, items);
    });
  }

  async storageRemoveItem(id, name) {
    await this.storage.get(name).then(items => {
      if (items) {
        items = items.filter(t => t.id != id);
        this.storage.set(name, items);
      }
    });
  }

  async storageUserProfile() {
    return this.storage.get('profile').then(profile => profile);
  }

  async generalAlert(header, message) {
    let okay;
    await this.translateService.get(header).subscribe(value => header = value);
    await this.translateService.get(message).subscribe(value => message = value);
    await this.translateService.get('Okay').subscribe(value => okay = value);
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'deleteCancel',
      buttons: [{
        text: okay,
        handler: () => {
          // this.events.publish('alert:success');
        }
      }
      ]
    });

    await alert.present();
  }

  async storageSaveAttendance(data) {
    const formatedDate = String(moment(data.date).format('YYYY-MM-DD')).split('-').join('_');
    const name = `attendance_${data.stream}_${formatedDate}`;
    return await this.storage.set(name, data.present);
  }

  async storageItemsToSync(name, save) {
    return await this.storage.get(name).then(data => {
      if (!save) {
        return data;
      }
      if (save) {
        data.offline_data = [];
        data.failed = 0;
        data.last_sync = moment().format('ddd, LL, hh:mm A');
        this.storage.set(name, data);
        this.presentToast("Syncing offline data completed successfully.")
      }
    });
  }

  async storageFailed(name, num) {
    return await this.storage.get(name).then(data => {
      data.failed = num;
      this.storage.set(name, data);
    });
  }

  // get first date of current month
  getFirstMonthDate() {
    const first = moment().startOf('M').format('YYYY-MM-DD')
    return first;
  }

  async loaderPreset(text, backdropDismiss = true) {
    await this.translateService.get(text).subscribe(value => text = value);
    this.isLoading = true;
    return await this.loadingCtr.create({
      backdropDismiss: backdropDismiss,

      message: text + '.....'
    }).then(async overlay => {
      await overlay.present().then(() => {
        if (!this.isLoading) { this.loadingCtr.dismiss(); }
        this.isLoading = false;
      });
    });
  }

  loaderDismiss() {
    this.isLoading ? this.isLoading = false : this.loadingCtr.dismiss();
  }
}

