import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { CommonService } from '../services/common-services/common.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-absence-reason',
  templateUrl: './absence-reason.page.html',
  styleUrls: ['./absence-reason.page.scss'],
})
export class AbsenceReasonPage implements OnInit {
  absentStudents = [];
  currentStream: any;
  classes: any;
  streamId: any = null;
  search_student: any;
  currentClassName: any;
  loader: boolean;
  emptyClass: string;
  date: any;
  absentReasons: any = [];
  active_student;
  other_option;
  selectedClassName: any;

  constructor(public popoverController: PopoverController,
    public alertController: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public events: Events,
    public router: Router,
    private datePicker: DatePicker,
    public activeRouter: ActivatedRoute,
    public commonService: CommonService, private callNumber: CallNumber, public translateService: TranslateService) { }

    ngOnInit() {
      const date = this.activeRouter.snapshot.paramMap.get('date');
      this.date = date ? date : moment().format('YYYY-MM-DD');
      const stream = this.activeRouter.snapshot.paramMap.get('stream');
      if (stream !== 'all') { this.streamId = stream; }
      // this.storageGetClasses();
      this.apiGetAbsentReasons();
    }

    ionViewWillEnter() {
      this.storageGetClasses();
    }
  
    async storageGetClasses() {
      return await this.storage.get('classes').then(classes => {
        if (classes) {
          this.classes = classes;
          if (!this.streamId) {
            console.log(classes[0])
            this.currentStream = classes[0].name;
            this.currentClassName = classes[0].base_class;
            this.selectedClassName = classes[0].class_name
            this.streamId = classes[0].id;
          } else {
            const currentStream = classes.filter(cl => cl.id == this.streamId);
            this.currentStream = currentStream[0].name;
            this.currentClassName = currentStream[0].base_class;
            this.selectedClassName = currentStream[0].class_name
            // this.streamId = currentStream[0].id;
          }
          this.apiGetAbsentStudents(this.streamId, this.date);
        } else { return this.emptyClass = 'No classes available offline'; }
      });
    }

    pickDate(event: any) {
      
      console.log('was it clicked')
      try {
        // Perform any additional logic here
        this.apiGetAbsentStudents(this.streamId, this.date);
      } catch(error) {
        console.error('Error in handleDateChange:', error);
      }
    }

    getMaxDate(): string {
      const today = moment();
      return today.format('YYYY-MM-DD');
    }
  
    getMinDate(): string {
      const today = moment();
      const minDate = today.subtract(30, 'days');
      return minDate.format('YYYY-MM-DD');
    }

    apiGetAbsentStudents(id, selectedDate) {
      this.emptyClass = '';
      this.commonService.loaderPreset('Loading');
      this.date = selectedDate;
      console.log(this.date, 'what date is it today')
      const url = `students/absents?date=${this.date}&stream=${id}`;
      this.absentStudents = [];
      this.commonService.generalFilter(url).subscribe(res => {
        this.commonService.loaderDismiss();
        if (res.results.length < 1) {
          this.absentStudents = [];
          return this.emptyClass = `This class has no absent learners`;
        }
        this.absentStudents = res.results;
      },
        error => {
          this.commonService.loaderDismiss();
          if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', 'Absent learners not available offline'); }
          return this.commonService.generalAlert('Error', 'An error occured please try again later');
        });
    }

    apiGetAbsentReasons() {
      this.commonService.generalFilter('students-absent-reasons').subscribe(res => {
        if (res.results.length < 1) {
          return this.commonService.generalAlert('No Absent Reasons', 'Please ask your administrator to provide reasons.');
        }
        const others = res.results.filter(reasons => reasons.name.toLocaleLowerCase() === 'other');
        if (others.length > 0) {
          const other = others[0]
          const index = res.results.indexOf(other);
          res.results.splice(index, 1);
          res.results.push(other);
        }
        this.absentReasons = res.results;
        // Check for item with other field
        /*
         * Note: 
         * Other id must be from the API
         * 
         */
        this.absentReasons.map(item => {
          if (item.name === 'other') {
            this.other_option = item;
            //Assign Handler to other item option
            item.handler = () => {
              this.alertController.dismiss()
              this.createReasonPopup();
            }
          }
          return item
        })
        console.log(this.absentReasons)
  
      });
    }
  
    apiPostStudentAbsentreason(data) {
      this.commonService.loaderPreset('Updating');
      this.commonService.generalPost(data, 'attendances/student-absent-reasons').subscribe(res => {
        this.commonService.loaderDismiss();
        this.absentStudents = this.absentStudents.map(student => {
          if (student.id === res.student) { student.reason_absent = res; }
          return student;
        });
        this.commonService.generalAlert('SUCCESS', 'Absence reason sucessfully updated.');
      },
        error => {
          this.commonService.loaderDismiss();
          if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`); }
          this.commonService.generalAlert('ERROR', 'An Error Occured. Please Try Again Later');
        });
    }

    apiUpdateStudentAbsentreason(data, reasonId) {
      this.commonService.loaderPreset('Updating');
      const url = `attendances/student-absent-reasons/${reasonId}`;
      this.commonService.generalEdit(data, url).subscribe(res => {
        this.commonService.loaderDismiss();
        this.absentStudents = this.absentStudents.map(student => {
          if (student.id === res.student) { student.reason_absent = res; }
          return student;
        });
        this.commonService.generalAlert('SUCCESS', 'Absence reason sucessfully updated.');
      },
        error => {
          this.commonService.loaderDismiss();
          if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`); }
          this.commonService.generalAlert('ERROR', 'An Error Occured. Please Try Again Later');
        });
    }
  
    async storageGetStream(id) {
      return await this.storage.get(`stream_${id}`).then(stream => {
        if (stream) {
          stream.students.length > 0 ? this.emptyClass = '' : this.emptyClass = `This class has no learners`;
          this.absentStudents = stream.students;
          this.currentClassName = stream.base_class;
          this.currentStream = stream.name;
          this.selectedClassName = stream.class_name
        } else { return this.emptyClass = 'No classes available offline'; }
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
          this.apiGetAbsentStudents(id, this.date);
          this.currentStream = res.data.name;
          this.currentClassName = res.data.base_class;
          this.selectedClassName = res.data.class_name
  
        }
      });
  
      return await popover.present();
    }
    individualattendance(std) {
      const student = `${std.id}_${std.first_name}_${std.last_name}`;
      this.router.navigate(['tabs/view-students/individual-attendance', { params: student }]);
    }
  
    async callNow(student) {
      // tslint:disable-next-line:max-line-length
      if (!student.guardian_phone) {
        return this.commonService.generalAlert('Contact Not Found', 'Please update guardian contact information!');
      }
      let cancel;
      let okay;
      let header;
      let message;
      const studentName = { name: `${student.first_name} ${student.last_name}` };
      await this.translateService.get('Okay').subscribe(value => okay = value);
      await this.translateService.get('Cancel').subscribe(value => cancel = value);
      await this.translateService.get('Call Guardian').subscribe(value => header = value);
      await this.translateService.get('Place a call to guardian?', studentName).subscribe(value => message = value);
      const alert = await this.alertController.create({
        header,
        message,
        cssClass: 'deleteCancel',
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            handler: (blah) => {
            }
          }, {
            text: okay,
            handler: () => {
              this.callNumber.callNumber(student.guardian_phone, true)
                .then()
                .catch();
            }
          }
        ]
      });
  
      await alert.present();
    }
  
  
    // Show Other Reason Pop up
    async createReasonPopup() {
  
      let header;
      let okay;
      let cancel;
      await this.translateService.get('Okay').subscribe(value => okay = value);
      await this.translateService.get('Cancel').subscribe(value => cancel = value);
      await this.translateService.get('Type in Reason').subscribe(value => header = value);
  
      const alert = await this.alertController.create({
        header,
        inputs: [
          {
            type: 'text',
            label: 'description'
          }
        ],
        buttons: [
          {
            text: cancel,
            role: 'cancel',
          }, {
            text: okay,
            handler: (text_data) => {
  
              const data = { reason: this.other_option.id, description: text_data[0], student: this.active_student.id, date: this.date };
  
              this.active_student.reason_absent ? this.apiUpdateStudentAbsentreason(data, this.active_student.reason_absent.id) :
                this.apiPostStudentAbsentreason(data);
            }
          }
        ]
      });
      await alert.present();
    }
  
    async reasonforAbsence(student) {
  
      this.active_student = student;
      if (this.absentReasons.length < 1) {
        return this.commonService.generalAlert('No absent Reasons', 'Please ask your administrator to provide reasons.')
      }
      this.absentReasons = this.absentReasons.map(reason => {
        reason.checked = student.reason_absent && reason.id === student.reason_absent.reason ? true : false;
        reason.type = reason.type ? reason.type : 'radio';
        reason.label = reason.description;
        reason.value = reason.id;
        return reason;
      });
      let cancel;
      let yes;
      let header;
      let update;
      await this.translateService.get('Update').subscribe(value => update = value);
      await this.translateService.get('Okay').subscribe(value => yes = value);
      await this.translateService.get('Cancel').subscribe(value => cancel = value);
      await this.translateService.get('Provide Reason for Absence').subscribe(value => header = value);
      console.log(this.absentReasons)
      const alert = await this.alertController.create({
        header,
        inputs: this.absentReasons,
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: student.reason_absent ? update : yes,
            handler: reason => {
              if (!reason) { return this.commonService.generalAlert('ERROR', 'Please select a reason'); }
              const data = { reason, student: student.id, date: this.date };
              student.reason_absent ? this.apiUpdateStudentAbsentreason(data, student.reason_absent.id) :
                this.apiPostStudentAbsentreason(data);
            }
          }
        ]
      });
  
      await alert.present();
    }
}
