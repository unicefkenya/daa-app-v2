import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import { Storage } from '@ionic/storage-angular';
import { StudentsService } from '../services/students-service/students.service';
import { SchoolService } from '../services/school-service/school.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-delete-reason',
  templateUrl: './delete-reason.page.html',
  styleUrls: ['./delete-reason.page.scss'],
})
export class DeleteReasonPage implements OnInit {
  student: any;
  deleteReasons: any;
  reasonValue: any;
  url: string;
  otherReason = '';
  error: string;
  streamId: string;
  otherId: string;
  offline = true;
  constructor(public alertController: AlertController,
    public activeRouter: ActivatedRoute,
    public commonService: CommonService,
    public storage: Storage,
    public router: Router,
    public navCtr: NavController,
    public studentsService: StudentsService,
    public schoolService: SchoolService,
    public events: Events,
    public loadingController: LoadingController) {
    // events.subscribe('alert:success', () => { navCtr.pop(); });
  }

  ngOnInit() {
    this.apiGetDeleteReasons();
    this.reasonValue = '';
    this.student = this.activeRouter.snapshot.paramMap.get('details').split('_');  // student_id, student_name, Stream_id, gender
    this.streamId = this.student[2];
  }

  async presentAlertConfirm() {
    this.error = '';
    let url = ''
    if (!this.reasonValue) { return this.error = 'Please select a reason'; }
    if (!this.otherReason.trim() && this.reasonValue == this.otherId) { return this.error = 'Please provide a reason'; }
    if (this.otherReason.trim() && this.reasonValue == this.otherId) {
      url = `students/${this.student[0]}/?reason=${this.reasonValue}&description='${this.otherReason}'`;
    } else {
      url = `students/${this.student[0]}/?reason=${this.reasonValue}`;
    }
    const alert = await this.alertController.create({
      header: 'Deactivate Learner',
      message: `Are you sure you want to deactivate ${this.student[1]}?`,
      cssClass: 'deleteCancel',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.ApiDelete(url);

          }
        }
      ]
    });

    await alert.present();
  }

  ApiDelete(url) {
    this.commonService.loaderPreset('Deactivating Learner');
    this.commonService.generalDelete(url).subscribe(res => {
      this.commonService.loaderDismiss();
      const subData = { id: this.student[0], gender: this.student[3] };

      if (this.student[3] === 'F') {
        this.commonService.storageChangeSchoolOverview([{ action: 'delete', F: 1, }]);
      } else { this.commonService.storageChangeSchoolOverview([{ action: 'delete', M: 1, }]); }

      this.commonService.storageRemoveStudentFromStream(subData, `stream_${this.streamId}`);
      this.events.publish('student:deleted', subData);
      this.navCtr.pop();
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.error = 'You must be online to deactivate a learner'; }
      });
  }

  apiGetDeleteReasons() {
    this.commonService.loaderPreset('Loading');
    const url = `students-delete-reasons`;
    this.commonService.generalGet(url).subscribe(res => {
      this.commonService.loaderDismiss();
      this.offline = false;

      const other = res.results.filter(reasons => reasons.name.toLocaleLowerCase() === 'other')[0];
      const index = res.results.indexOf(other);
      this.otherId = other.id;
      res.results.splice(index, 1);
      res.results.push(other);
      this.events.publish('loader');
      this.deleteReasons = res.results;
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) {
          this.offline = true;
          this.commonService.generalAlert('OFFLINE', 'You must be online to deactivate a learner');
          this.navCtr.pop();
          return;
        }
        console.log(error);
      });
  }


}
