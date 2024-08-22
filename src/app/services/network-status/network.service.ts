import { Injectable, EventEmitter } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { CommonService } from '../common-services/common.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public onlineOffline: boolean = navigator.onLine;
  public hasInternet = false

  public internetStatus$ = new EventEmitter()

  constructor(private network: Network, public commonService: CommonService) { // private network: Network,
  }

  connection() {
    this.hasInternet = this.networkType != this.network.Connection.NONE
    this.network.onConnect().subscribe(() => {
      console.log("Internet connectd")
      this.hasInternet = true
      this.syncStudentsData();
      this.syncAttendanceData();
      this.internetStatus$.emit(true)
      // this.commonService.presentToast("Connected to the internet.")
    });
  }

  get connectionTypes() {
    return this.network.type
  }

  get networkType() {
    return this.network.type
  }

  disConnection() {
    this.network.onDisconnect().subscribe(() => {
      this.hasInternet = false
      this.internetStatus$.emit(false)
      this.commonService.presentToast("No internet connection.")
      console.log("Internet disconnected..")
    });
  }

  async syncStudentsData() {
    return await this.commonService.storageItemsToSync('students_to_sync', false).then(data => {
      if (data) {
        const size = data.offline_data.length;
        if (size > 0) {
          this.commonService.generalPost(data.offline_data, 'students/bulk').subscribe(async res => {
            const females = res.filter(std => std.gender === 'F').length;
            const males = res.filter(std => std.gender === 'M').length;

            const toStorage = [];
            const streams = new Set(res.map(student => student.stream));
            streams.forEach(stream => {
              const allStudents = res.filter(dt => dt.stream == stream);
              const toSave = { to: stream, from: null, students: allStudents };
              toStorage.push(toSave);
            });
            Promise.all(toStorage.map(dt => {
              return this.commonService.storageBulkMoveStudents(dt);
            }));
            this.commonService.storageChangeSchoolOverview([{ action: 'add', F: females, M: males }]);
            this.commonService.storageItemsToSync('students_to_sync', true);
          },
            error => {
              console.log(error)
              this.commonService.storageFailed('students_to_sync', size);
            });
        }
      }
    });
  }

  async syncAttendanceData() {
    return await this.commonService.storageItemsToSync('att_to_sync', false).then(data => {
      if (data) {
        const size = data.offline_data.length;
        if (size > 0) {
          this.commonService.presentToast(`Syncing ${size} offline attendances.`)
          this.commonService.generalPost(data.offline_data, 'attendances').subscribe(res => {
            Promise.all(res.map(att => {
              return this.commonService.storageSaveAttendance(att);
            }));
            this.commonService.storageItemsToSync('att_to_sync', true);
          },
            error => {
              console.log(error)
              this.commonService.storageFailed('att_to_sync', size);
            });
        }
      }
    });
  }

}
