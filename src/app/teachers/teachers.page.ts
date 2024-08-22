import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { CommonService } from '../services/common-services/common.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit {

  search_teacher: any;
  teachers = [];
  error: string;
  noTeachers = '';

  constructor(public alertController: AlertController, public navCtrl: NavController, public storage: Storage,
    public commonService: CommonService, public router: Router,
    public events: Events) {
    events.subscribe('teacher:created', data => {
      this.teachers.push(data);
      this.noTeachers = '';
    });
    events.subscribe('teacher:edited', data => {
      const teacher = this.teachers.filter(t => t.id == data.id)[0];
      const index = this.teachers.indexOf(teacher);
      this.teachers[index] = data;
    });
  }

  ngOnInit() {
    this.storageGetTeachers();
  }

  ionViewWillEnter() {
    // console.log(`Getting the teachers...`)
    this.storageGetTeachers();
  }

  async deleteTeacher(teacher) {
    const id = teacher.id;
    const alert = await this.alertController.create({
      header: 'Delete!',
      message: 'Are you sure you want to delete the teacher?',
      cssClass: 'deleteCancel',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.ApiDeleteTeacher(id);
          }
        }
      ]
    });

    await alert.present();
  }

  gotoaddteachers() {
    this.router.navigate(['tabs/teachers/add-teacher']);
  }

  goEditTeacher(teacher) {
    this.router.navigate(['/tabs/teachers/add-teacher'], { state: { instance: teacher } });
  }

  async storageGetTeachers() {
    this.storage.get('teachers').then(data => {
      if (data.length > 0) {
        this.teachers = data;
      } else { this.noTeachers = 'No teachers'; }
    });
  }

  ApiDeleteTeacher(id) {
    this.commonService.loaderPreset('Deleting Teacher');
    const url = `teachers/${id}/`;
    this.commonService.generalDelete(url).subscribe(res => {
      this.commonService.loaderDismiss();
      this.commonService.storageRemoveItem(id, 'teachers');
      this.teachers = this.teachers.filter(teacher => teacher.id != id);
      if (this.teachers.length < 1) { this.noTeachers = 'No teachers'; }
      this.commonService.storageChangeSchoolOverview([{ action: 'delete', teachers: 1 }]);
      this.events.publish('teacher:deleted');
      this.commonService.generalAlert('Delete successful', 'Teacher has been deleted successfully');
    }, error => {
      this.commonService.loaderDismiss();
      if (error.status === 0) { return this.commonService.generalAlert('Offline', 'You can not delete a class while offline'); }
      this.commonService.generalAlert('Error', 'Teacher Not Deleted please try again after sometime');
    });
  }

}
