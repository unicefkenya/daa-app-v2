import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common-services/common.service';
import { Events } from 'src/app/services/common-services/events';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  classes = [];
  search_class: any;
  noClass = '';
  error = '';

  constructor(public alertController: AlertController, public navCtrl: NavController, public router: Router,
    public storage: Storage, public commonService: CommonService, public events: Events) {

    this.events.subscribe('class:created', addedClass => { this.classes.push(addedClass); this.noClass = ''; });
    this.events.subscribe('class:edited', editedClass => {
      const Myclass = this.classes.filter(cl => cl.id == editedClass.id)[0];
      const index = this.classes.indexOf(Myclass);
      this.classes[index] = editedClass;
    });
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.storageGetClasses();
  }


  async deleteclass(classData) {
    const cl = classData;
    const alert = await this.alertController.create({
      header: 'Delete!',
      message: `Are you sure you want to delete class ${cl.base_class}${cl.name}?`,
      cssClass: 'deleteCancel',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            ;
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.apiDeleteClass(cl.id);
          }
        }
      ]
    });

    await alert.present();
  }

  goEditClass(classData) {
    const dataToPush = classData.id;
    this.router.navigate(['tabs/classes/add-class', { id: dataToPush }]);

    // this.router.navigate(['tabs/classes/add-class'], { state: classData });

  }

  gotoaddclasses() {
    this.navCtrl.navigateForward('tabs/classes/add-class');
  }

  apiDeleteClass(id) {
    this.commonService.loaderPreset('Deleting Class');
    const url = `streams/${id}/`;
    this.commonService.generalDelete(url).subscribe(res => {
      this.commonService.loaderDismiss();
      this.commonService.storageRemoveItem(id, 'classes');
      this.events.publish('class:deleted', id);
      this.classes = this.classes.filter(cl => cl.id != id);
      if (this.classes.length < 1) { this.noClass = 'No classes available' };
      this.commonService.storageChangeSchoolOverview([{ action: 'delete', classes: 1 }]);
      this.commonService.generalAlert('Delete successfull', 'Class has been deleted successfully');
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.commonService.generalAlert('Offline', 'You can not delete a class while offline'); }
        if (error.error && error.error.hasOwnProperty("detail")) {
          this.commonService.generalAlert('Error', error.error.detail);
        } else {
          this.commonService.generalAlert('Error', 'Class Not Deleted please try again after sometime');
        }
      });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(data => {
      if (data) {
        if (data.length > 0) {
          this.classes = data;
        } else { this.noClass = 'No classes available'; }
      } else { this.noClass = 'No classes available'; }
    });
  }

}
