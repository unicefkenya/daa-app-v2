import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as moment from 'moment';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { StudentsService } from '../services/students-service/students.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-overall-reports',
  templateUrl: './overall-reports.page.html',
  styleUrls: ['./overall-reports.page.scss'],
})
export class OverallReportsPage implements OnInit {
  stream = [];
  currentStream: any;
  classes: any = [];
  streamId: any
  search_student: any;
  currentClassName: any;
  loader: boolean;
  emptyClass: string;
  present: any;
  absent: any;
  pieData: any;
  date: any;
  pieDataReady = false;
  results: any;
  allClassesReport = true;
  schoolInfo: any;
  absentStudents: any = [];
  isAdmin = false;
  newAtt = false;
  user = null
  idType = "stuff"
  selectedClassName: any

  constructor(public popoverController: PopoverController,
    public alertController: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public events: Events,
    public router: Router,
    public activeRouter: ActivatedRoute,
    public commonService: CommonService,
    private callNumber: CallNumber,
    private datePicker: DatePicker,
    public studentsService: StudentsService) {

    this.events.subscribe('att:taken', () => {
      console.log("dadd..")
      this.newAtt = true;
    });
  }

  ngOnInit() {
    console.log("Onint..")
    this.fetchStorage()
  }
  ionViewWillEnter() {
    this.storageGetUserProfile();
  }
  fetchStorage() {
    this.date = moment(Date.now()).format('LL');
    this.activeRouter.queryParams
      .subscribe(() => {
        console.log("route")
        console.log(this.allClassesReport)
        if (this.newAtt) {
          this.storageGetUserProfile().then(res => {
            console.log(res)
            this.ApiGetReport();
            this.newAtt = false;
          });
        }
      });
  }

  ApiGetReport() {
    this.pieDataReady = false;
    this.commonService.loaderPreset('Loading', true);
    const selectedDate = moment(this.date).format('YYYY-MM-DD');
    this.emptyClass = '';
    let url: string;
    console.log(this.allClassesReport)

    if (this.allClassesReport) {
      url = `daily?date=${selectedDate}&school=${this.streamId}&return_type=count`;
    } else {
      url = `daily?date=${selectedDate}&stream=${this.streamId}&return_type=count`;
    }
    this.studentsService.getStudentAttendanceSummary(url).subscribe(data => {
      this.commonService.loaderDismiss();
      if (data.results.length < 1) { this.pieDataReady = false; return this.emptyClass = 'Attendance for this date was not taken'; }
      this.results = data.results[0];
      this.results.total_absent = this.results.absent_males + this.results.absent_females;
      this.results.total_persent = this.results.present_males + this.results.present_females;
      this.preparePieChart(data.results[0]);
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.emptyClass = `You can't perform this operation offline`; }
        this.commonService.generalAlert('ERROR', 'An Error Occured. Please Try Again Later');
      });
  }

  getStorageOnly() {
    return this.commonService.storageUserProfile().then(user => {
      this.user = user
      if (user) {
        if (user.is_school_admin) { this.isAdmin = true; }
      }
      return user
    });
  }

  storageGetUserProfile() {
    return this.commonService.storageUserProfile().then(user => {
      this.user = user
      if (user) {
        if (user.is_school_admin) { this.isAdmin = true; }
      }
      this.storageGetSchool();
      return user
    });
  }

  storageGetSchool() {
    this.storage.get('overview').then(data => {
      this.schoolInfo = data;
      this.storageGetClasses();
    });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(res => {
      if (!res) { return this.emptyClass = 'No classes available offline'; }
      this.classes = []
      if (res.length > 0) {
        if (!this.streamId) {
          if (this.isAdmin) {
            this.classes = [{ id: 'all', name: null }];
            this.streamId = this.schoolInfo.id;
            this.allClassesReport = true
          } else {
            this.currentStream = res[0].name;
            this.currentClassName = res[0].base_class;
            this.selectedClassName = res[0].class_name
            this.streamId = res[0].id;
            this.allClassesReport = false;
          }
        }
        this.classes = this.classes.concat(res);
        this.ApiGetReport();
        if (this.allClassesReport) { this.apiGetAbsentCount(); }
      } else { console.log('test seeen'); this.emptyClass = 'No classes available offline'; }
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
      console.log(res.data)
      if (String(id) !== String(this.streamId) || res.data.name !== this.currentStream) {
        if (id === 'all') {
          this.allClassesReport = true;
          //Set as the school id
          this.streamId = this.user.school;
        } else {
          this.allClassesReport = false;
          this.currentStream = res.data.name;
          this.currentClassName = res.data.base_class;
          this.selectedClassName = res.data.class_name

          this.streamId = id;
        }

        this.ApiGetReport();
        if (this.allClassesReport) { this.apiGetAbsentCount(); }
      }
    });
    return await popover.present();
  }

  pickDate() {
    this.datePicker.show({
      date: new Date(),
      maxDate: new Date().valueOf(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
    }).then(selectedDate => {
      const myDate = moment(selectedDate).format('LL');
      if (this.date === myDate) { return; }
      this.date = myDate;
      // this.allClassesReport = false;
      this.ApiGetReport();
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  callNow(num) {
    console.log(num);
    this.callNumber.callNumber(num, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  preparePieChart(data) {
    this.pieData = {
      labels: ['Boys Present', 'Girls Present', 'Boys Absent', 'Girls Absent'],
      datasets: [{
        label: 'Daily Attendance Report',
        backgroundColor: [
          '#2096f3', '#3CB043', '#F5D908', '#FF5733'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        data: [data.present_males, data.present_females, data.absent_males, data.absent_females],
        borderWidth: 0
      }]
    };
    this.pieDataReady = true;
  }

  apiGetAbsentCount() {
    const selectedDate = moment(this.date).format('YYYY-MM-DD');
    const url = `attendances/stream?date=${selectedDate}&school=${this.schoolInfo.id}&return_type=count`;
    this.commonService.generalFilter(url).subscribe(res => {
      if (res.results.length < 1) { return; }
      res.results.map(data => {
        const streamDetails = data.value.split('_');
        const id = streamDetails.pop();
        const baseClass = streamDetails.shift();
        const name = `${baseClass}${streamDetails.join('_')}`;
        const absent = {
          absent: data.absent,
          class_name: name,
          id
        };
        this.absentStudents.push(absent);
      });
    },
      error => {
        console.log(error);
      });
  }

  gotoabsence() {
    const date = moment(this.date).format('YYYY-MM-DD');
    const stream = this.allClassesReport ? 'all' : this.streamId;
    console.log(this.allClassesReport)
    console.log(stream)
    this.router.navigate(['tabs/absence-reason', { date, stream }]);
  }


}
