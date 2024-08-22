import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import * as moment from 'moment';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { CommonService } from '../services/common-services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  stream: any;
  classes: any;
  date: any;
  currentStreamName: string;
  currentClassName: string;
  streamId: string;
  loader = true;
  editBtn = false;
  emptyClass: string;
  change = false;
  boysAbsent: any;
  boysPresent: any;
  selectedClassName: any

  constructor(private commonService: CommonService, public alertController: AlertController,
    public popoverController: PopoverController,
    private storage: Storage,
    private datePicker: DatePicker,
    private events: Events,
    public router: Router,
    public loadingController: LoadingController,
    public activatedRoute: ActivatedRoute,
    public translateService: TranslateService) {

    events.subscribe('page:att_overview', () => {
      this.change = true;
    });
  }

  ngOnInit() {
    this.date = moment().format('LL');
    this.storageGetClasses();
    this.activatedRoute.queryParams
      .subscribe(() => {
        this.change ? this.change = false : this.storageGetClasses();
      });
    this.loader = false;
  }
  ionWillEnter() {
    this.storageGetClasses();
  }

  pickDate() {
    this.datePicker.show({
      date: new Date(),
      maxDate: new Date().valueOf(),
      minDate: new Date(new Date().setDate(new Date().getDate() - 30)).valueOf(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
    }).then(selectedDate => {
      const myDate = moment(selectedDate).format('LL');
      if (this.date === myDate) { return; }
      this.loader = true;
      this.date = myDate;
      this.storageGetAttendance(this.stream);
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  async attendance() {
    const present = this.stream.filter(dt => dt.attendance === true);
    const pres = present.map(student => student.id);
    this.boysPresent = present.filter(student => student.gender === 'M').length;
    const absent = this.stream.filter(dt => dt.attendance === false)
    const abs = absent.map(student => student.id);
    this.boysAbsent = absent.filter(student => student.gender === 'M').length;
    const data = { present: pres, absent: abs, date: moment(this.date).format('YYYY-MM-DD'), stream: this.streamId };
    const translated = [];
    let yes;
    let cancel;
    const params = {
      class: `${this.currentClassName}${this.currentStreamName}`,
      students: `${abs.length}`,
      date: `${this.date}`
    };
    await this.translateService.get('Yes').subscribe(value => yes = value);
    await this.translateService.get('Cancel').subscribe(value => cancel = value);
    await this.translateService.get('Take attendance').subscribe(value => translated.push(value));
    await this.translateService.get('Take class attendance with students absent on', params).subscribe(value => translated.push(value));
    const alert = await this.alertController.create({
      header: `${translated[0]}?`,
      message: translated[1],
      cssClass: 'deleteCancel',
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: yes,
          handler: () => {
            this.ApiSubmitAttendance(data);
          }
        }
      ]
    });
    await alert.present();
  }

  ApiSubmitAttendance(data) {
    const present = data.present.length;
    const absent = data.absent.length;
    this.events.publish('att:taken');
    this.commonService.loaderPreset('Submitting Attendance');
    this.commonService.generalPost(data, 'attendances').subscribe(res => {
      this.events.publish('att:update');
      this.commonService.loaderDismiss();
      this.editBtn = true;
      this.commonService.storageSaveAttendance(res);
      this.router.navigate(['/tabs/attendance-overview'], {
        queryParams: { present, absent, stream: data.stream, boys_present: this.boysPresent, boys_absent: this.boysAbsent }
      });
    },
      error => {
        this.commonService.loaderDismiss();
        this.editBtn = true;

        this.commonService.storageSaveAttendance(data);
        this.toBeSubmitedAtt(data);
        this.router.navigate(['/tabs/attendance-overview'], {
          queryParams: { present, absent, stream: data.stream, boys_present: this.boysPresent, boys_absent: this.boysAbsent }
        });
      });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(res => {
      if (res) {
        if (res.length > 0) {
          this.classes = res;
          this.currentStreamName = res[0].name;
          this.currentClassName = res[0].base_class;
          this.streamId = res[0].id;
          this.selectedClassName = res[0].class_name
          this.storageGetStream(this.streamId);
          return;
        }
      }
      this.emptyClass = 'No classes available offline';
    });
  }

  async storageGetAttendance(students) {
    const formatedDate = String(moment(this.date).format('YYYY-MM-DD')).split('-').join('_');
    const name = `attendance_${this.streamId}_${formatedDate}`;
    return await this.storage.get(name).then(data => {
      if (data) {
        const att = students.map(student => {
          data.includes(student.id) ? student.attendance = true : student.attendance = false;
          return student;
        });
        data.length < 1 ? this.editBtn = false : this.editBtn = true;
        this.stream = att;
        if (this.stream.length < 1) { return this.emptyClass = 'This class has no learners'; }
        this.emptyClass = '';
      } else {
        const att = students.map(student => {
          student.attendance = false;
          return student;
        });
        this.stream = att;
        if (this.stream.length < 1) { return this.emptyClass = 'This class has no learners'; }
        this.editBtn = false;
        this.emptyClass = '';
      }
    });
  }

  async storageGetStream(id) {
    this.stream = [];
    if (id == "teachers") {
      return await this.storage.get("teachers").then(res => {
        console.log("teachers")
        console.log(res)
        if (res.length > 0) {
          this.storageGetAttendance(res);
        } else {
          this.emptyClass = "No teachers found"
        }
      })
    }
    return await this.storage.get(`stream_${id}`).then(res => {
      if (res) {
        console.log("Learners")
        console.log(res)
        if (res.students.length < 1) {
          this.editBtn = false;
          return this.emptyClass = 'This class has no learners';
        }
        this.storageGetAttendance(res.students);
      } else { this.emptyClass = 'Class not available offline'; }
    });

  }

  get isAClass() {
    if (!this.currentStreamName)
      return true
    return !this.currentClassName.includes("All")
  }



  async toBeSubmitedAtt(data) {
    const allData = [];
    await this.storage.get('att_to_sync').then(async dt => {
      if (dt) {
        await dt.offline_data.map(att => {
          if (String(att.stream) === String(data.stream) && (String(data.date) === String(att.date))) {

          } else {
            allData.push(att);
          }
        });
        allData.push(data);
        dt.offline_data = allData;
        await this.storage.set('att_to_sync', dt);

      } else {
        allData.push(data);
        const sync = {
          offline_data: allData,
          last_sync: " ",
          failed: 0
        };
        await this.storage.set('att_to_sync', sync);
      }
      this.commonService.presentToast("Attendance saved offline.")
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ClasspopoverPage,
      event: ev,
      translucent: true,
      componentProps: { classes: this.classes }
    });

    popover.onDidDismiss().then(res => {
      if (res.data === undefined) { return; }
      const id = res.data.id;
      if (String(id) !== String(this.streamId)) {
        this.streamId = id;
        this.storageGetStream(id);
        this.currentStreamName = res.data.name;
        this.currentClassName = res.data.base_class;
        this.selectedClassName = res.data.class_name
      }
    });

    return await popover.present();
  }

  // function to be removed used for testing
  async toBeSynced() {
    return await this.storage.get('att_to_sync').then(data =>
      console.log(data));
  }

}
