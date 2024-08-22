import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common-services/common.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-myschool',
  templateUrl: './myschool.page.html',
  styleUrls: ['./myschool.page.scss'],
})
export class MyschoolPage implements OnInit {
  boys: any;
  girls: any;
  schoolName: any;
  teachersCount: any;
  classesCount: any;
  user: any;
  total: any;
  isAdmin = false;
  constructor(public navCtrl: NavController, public storage: Storage,
    public events: Events,
    public commonService: CommonService) {

    events.subscribe('student:deleted', deletedStudent => {
      if (deletedStudent.gender === 'M') { this.boys -= 1; }
      if (deletedStudent.gender === 'F') { this.girls -= 1; }
    });
    events.subscribe('student:created', newStudent => {
      if (newStudent.gender === 'M') { this.boys += 1; }
      if (newStudent.gender === 'F') { this.girls += 1; }
    });
    events.subscribe('gender:edited', student => {
      if (student.gender === 'M') { this.boys += 1; this.girls -= 1; console.log('seen'); }
      if (student.gender === 'F') { this.girls += 1; this.boys -= 1; }
    });
    events.subscribe('teacher:created', () => this.teachersCount += 1);
    events.subscribe('teacher:deleted', () => this.teachersCount -= 1);
    events.subscribe('class:deleted', () => this.classesCount -= 1);
    events.subscribe('class:created', () => this.classesCount += 1);

  }

  ngOnInit() {
    this.getProfile();
    this.storageSchoolOverview();
  }

  ionViewWillEnter() {
    this.getProfile();
    this.storageSchoolOverview();
  }

  gotostudents() {
    this.navCtrl.navigateForward('/tabs/students');
  }

  gotomovestudents() {
    this.navCtrl.navigateRoot('/tabs/move-students');
  }

  gotopromotestudents() {
    this.navCtrl.navigateRoot('/tabs/promote');
  }

  gototeachers() {
    this.navCtrl.navigateForward('/tabs/teachers');
  }

  gotoclasses() {
    this.navCtrl.navigateForward('/tabs/classes');
  }

  gotoreasonforabsence() {
    this.navCtrl.navigateRoot('/tabs/absence-reason')
  }

  gotodeactivatedlearners(){
    this.navCtrl.navigateForward('/tabs/deactivated-learners')
  }

  viewstudents() {
    this.navCtrl.navigateForward('/tabs/view-students');
  }

  async storageSchoolOverview() {
    return await this.storage.get('overview').then(data => {
      if (data) {
        this.boys = data.male;
        this.girls = data.female;
        this.schoolName = data.name;
        this.classesCount = data.classes;
        this.teachersCount = data.teachers;
        this.total = data.male + data.female;
      }
    });
  }

  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      data.is_school_admin ? this.isAdmin = true : this.isAdmin = false;
    });
  }

}
