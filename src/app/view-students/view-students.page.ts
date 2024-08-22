import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.page.html',
  styleUrls: ['./view-students.page.scss'],
})
export class ViewStudentsPage implements OnInit {
  stream = [];
  currentStream: any;
  classes: any;
  streamId: any;
  search_student: any;
  currentClassName: any;
  loader: boolean;
  emptyClass: string;

  constructor(public popoverController: PopoverController,
    public alertController: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public events: Events,
    public router: Router,
    public activeRouter: ActivatedRoute,
    public commonService: CommonService, private callNumber: CallNumber, public translateService: TranslateService) { }

  ngOnInit() {
    this.storageGetClasses();
  }
  ionViewWillEnter() {
    this.storageGetClasses();
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(classes => {
      if (classes) {
        this.classes = classes;
        this.currentStream = classes[0].name;
        this.currentClassName = classes[0].base_class;
        this.streamId = classes[0].id;
        this.storageGetStream(this.streamId);
      } else { this.emptyClass = 'No classes available offline!'; return this.loader = false; }
    });
  }

  async storageGetStream(id) {
    return await this.storage.get(`stream_${id}`).then(stream => {
      if (stream) {
        stream.students.length > 0 ? this.emptyClass = '' : this.emptyClass = 'This class has no learners!';
        this.stream = stream.students;
        this.currentClassName = stream.base_class;
        this.currentStream = stream.name;
      } else { this.emptyClass = 'No classes available offline'; return this.loader = false; }
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
        this.currentStream = res.data.name;
        this.currentClassName = res.data.base_class;
      }
    });

    return await popover.present();
  }


  individualattendance(std) {
    const student = `${std.id}_${std.first_name}_${std.last_name}`;
    this.router.navigate(['tabs/view-students/individual-attendance', { params: student }], { state: { student: std } });
  }

  async callNow(student) {
    // tslint:disable-next-line:max-line-length
    if (!student.guardian_phone) { return this.commonService.generalAlert('Contact Not Found', 'Please update guardian contact information!'); }
    let cancel;
    let yes;
    let header;
    let message;
    const studentName = { name: `${student.first_name} ${student.last_name}` };
    await this.translateService.get('Yes').subscribe(value => yes = value);
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
          text: yes,
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
}
