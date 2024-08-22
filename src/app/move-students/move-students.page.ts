import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { CommonService } from '../services/common-services/common.service';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-move-students',
  templateUrl: './move-students.page.html',
  styleUrls: ['./move-students.page.scss'],
})
export class MoveStudentsPage implements OnInit {
  stream = [];
  emptyClass = false;
  classes: any;
  currentStreamName: string;
  currentClassName: string;
  loader = false;
  streamId: any;
  markAll = false;
  selectedIds = [];
  error = '';
  allIds = [];
  change = true;
  constructor(public alertController: AlertController, public storage: Storage, public popoverController: PopoverController,
    public events: Events, public commonService: CommonService, public activatedRoute: ActivatedRoute,
    public translateService: TranslateService) {

    events.subscribe('class:created', () => { this.change = true; });
    events.subscribe('class:deleted', () => { this.change = true; });
    events.subscribe('class:edited', () => { this.change = true; });
    events.subscribe('student:created', () => { this.change = true; });
    events.subscribe('student:edit', () => { this.change = true; });
    events.subscribe('student:deleted', () => { this.change = true; });

  }

  ngOnInit() {
    this.storageGetClasses();
    this.activatedRoute.queryParams
      .subscribe(() => {
        if (this.change) {
          this.storageGetClasses();
          this.change = false;
        }
      });

  }
  ionWillEnter() {
    this.storageGetClasses();
    this.activatedRoute.queryParams
      .subscribe(() => {
        if (this.change) {
          this.storageGetClasses();
          this.change = false;
        }
      });

  }

  markAllCheck() {
    if (this.markAll) { this.selectedIds = []; this.stream = this.stream.map(data => { data.attendance = false; return data; }); }
    if (!this.markAll) {
      this.selectedIds = this.allIds.slice();
      this.stream = this.stream.map(data => { data.attendance = true; return data; });
    }
  }

  singleCheck(id) {
    this.selectedIds.includes(id) ? this.selectedIds.splice(this.selectedIds.indexOf(id), 1) : this.selectedIds.push(id);
    this.selectedIds.length === this.stream.length ? this.markAll = true : this.markAll = false;
  }

  async movestudentAlert() {
    this.error = '';
    let marked = this.stream.filter(data => data.attendance === true);
    if (marked.length < 1) { return this.commonService.generalAlert('Error', 'Select atleast one learner!'); }
    const checkBoxInput = this.classes.filter(data => data.id != this.streamId).map(data => {
      const className = `${data.base_class}${data.name}`;
      return { name: className, type: 'radio', label: className, value: data.id, checked: false };
    });
    let cancel;
    let okay;
    let header;
    await this.translateService.get('Okay').subscribe(value => okay = value);
    await this.translateService.get('Cancel').subscribe(value => cancel = value);
    await this.translateService.get('Move learners to class?').subscribe(value => header = value);
    const alert = await this.alertController.create({
      header,
      inputs: checkBoxInput,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          cssClass: 'move-students-class',
          handler: () => {
          }
        }, {
          text: okay,
          handler: data => {
            if (data === undefined) { this.error = 'Select which class to move learners to!'; return; }
            // tslint:disable-next-line:max-line-length
            marked = marked.map(student => { student.stream = data; delete student.attendance; return student; });
            this.apiMoveStudents(marked);
          }
        }
      ]
    });

    await alert.present();
  }

  apiMoveStudents(data) {
    this.commonService.loaderPreset('Moving Students');
    this.commonService.generalEdit(data, 'students/bulk').subscribe(res => {
      this.commonService.loaderDismiss();
      this.commonService.storageBulkMoveStudents({ to: res[0].stream, from: this.streamId, students: res });
      this.stream = this.stream.filter(student => student.attendance === false);
      if (this.stream.length < 1) { this.emptyClass = true; }
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.commonService.generalAlert('OFFLINE', 'You can only move learners when online'); }
        this.commonService.generalAlert('ERROR', 'An error occured please try again after sometime');
      });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(res => {
      if (res) {
        if (res.length < 1) { return this.emptyClass = true; }
        this.classes = res;
        this.currentStreamName = res[0].name;
        this.currentClassName = res[0].base_class;
        this.streamId = res[0].id;
        this.storageGetStream(res[0].id);
      } else { this.emptyClass = true; }
    });
  }

  async storageGetStream(id) {
    return await this.storage.get(`stream_${id}`).then(res => {
      if (res) {
        this.markAll = false;
        res.students.length > 0 ? this.emptyClass = false : this.emptyClass = true;
        res.students = res.students.map(student => { student.attendance = false; this.allIds.push(student.id); return student; });
        this.stream = res.students;
      } else { this.emptyClass = true; }
      return this.loader = false;
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
      }
    });
    return await popover.present();
  }

}
