import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import { AuthService } from '../services/auth-services/auth.service';

@Component({
  selector: 'app-update-attendance',
  templateUrl: './update-attendance.page.html',
  styleUrls: ['./update-attendance.page.scss'],
})
export class UpdateAttendancePage implements OnInit {
  syncDate: string;
  itemsToSyc = [];
  itemNo: any;
  student = null;
  internet: boolean;
  failed = 0;
  isTestingOnline: boolean = false
  internetCheckInterval = null
  constructor(public storage: Storage, public activatedRoute: ActivatedRoute, public commonService: CommonService,
    public authService: AuthService) { }

  ngOnInit() {
    this.testOffline();
    this.student = this.activatedRoute.snapshot.paramMap.get('student');
  }

  triggerSync() {
    this.student ? this.storageItemsToSync('students_to_sync', false) : this.storageItemsToSync('att_to_sync', false);
  }

  ionViewWillEnter() {
    this.testOffline()
    console.log("Did Enter..")
    this.internetCheckInterval = setInterval(() => {
      this.testOffline()
    }, 2000)
    this.triggerSync()
  }
  ionViewDidLeave() {
    if (this.internetCheckInterval) {
      clearInterval(this.internetCheckInterval)
    }

  }
  ionViewWillUnload() {
    if (this.internetCheckInterval) {
      clearInterval(this.internetCheckInterval)
    }
  }

  setInternetStatus(status) {
    if (this.internet === status) return
    const isReconnecting = !this.internet
    this.internet = status;

    if (isReconnecting) {
      console.log("Reconnecting, triggering sync...")
      this.triggerSync()
    } else {

    }

  }

  testOffline() {
    // console.log("Testing internet...")
    // this.commonService.loaderPreset('Loading');
    this.isTestingOnline = true
    this.commonService.generalGet('ping').subscribe((res) => {
      this.setInternetStatus(true)
      this.isTestingOnline = false
      // this.commonService.loaderDismiss();
    },
      error => {
        this.isTestingOnline = false
        // this.commonService.loaderDismiss();
        if (error.status === 0) { this.setInternetStatus(false); return; }
        this.setInternetStatus(true);
      });
  }

  attendance() {
    this.commonService.loaderPreset('Updating');
    this.authService.getSchoolInfo().subscribe(res => {
      this.commonService.loaderDismiss();
      this.commonService.generalAlert('SUCCESS', 'Classes list updated Successfully!');
    },
      error => {
        if (error.status === 0) { this.commonService.generalAlert('OFFLINE', 'To update a classes list you must be online!'); }
        this.commonService.loaderDismiss();
      });
  }

  get storageDataArray() {
    return "offline_data"
  }

  async storageItemsToSync(name, save) {
    console.log(`Triggering ${name}`)
    return await this.commonService.storageItemsToSync(name, save).then(data => {
      if (!save) {
        if (data) {
          this.syncDate = moment(data.last_sync).format('ddd, LL, hh:mm A');
          this.itemsToSyc = data[this.storageDataArray];
          this.itemNo = data[this.storageDataArray].length;
          this.failed = data.failed;
        } else {
          this.syncDate = moment().format('ddd, LL, hh:mm A');
          this.itemNo = 0;
          this.failed = 0;
        }
      }
    });
  }
}
