import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common-services/common.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  stream = [];
  currentStream: any;
  classes: any;
  streamId: any;
  search_student: any;
  currentClassName: any;
  loader: boolean;
  emptyClass: string;
  change = true;
  selectedClassName: any


  constructor(public popoverController: PopoverController,
    public alertController: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public events: Events,
    public router: Router,
    public activeRouter: ActivatedRoute,
    public commonService: CommonService) {


    events.subscribe('student:deleted', deletedStudent => {
      this.stream = this.stream.filter(stream => String(stream.id) !== String(deletedStudent.id));
    });
    events.subscribe('student:moved', movedStudent => {
      this.stream = this.stream.filter(move => String(move.id) !== String(movedStudent.id));
    });
    events.subscribe('student:created', newStudent => {
      this.emptyClass = '';
      this.stream.push(newStudent);
    });
    events.subscribe('student:edit', editedStudent => {
      const student = this.stream.filter(std => Number(std.id) === Number(editedStudent.id))[0];
      const index = this.stream.indexOf(student);
      this.stream[index] = editedStudent;
    });
    events.subscribe('class:created', () => { this.change = true; });
    events.subscribe('class:deleted', () => { this.change = true; });
    events.subscribe('class:edited', () => { this.change = true; });
  }

  ngOnInit() {
    this.storageGetClasses();
    this.activeRouter.queryParams
      .subscribe(() => {
        if (this.change) {
          this.storageGetClasses();
          this.change = false;
        }
      });
  }
  ionViewWillEnter() {
    this.storageGetClasses();
    this.activeRouter.queryParams
      .subscribe(() => {
        if (this.change) {
          this.storageGetClasses();
          this.change = false;
        }
      });
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(classes => {
      if (classes) {
        this.classes = classes;
        this.currentStream = classes[0].name;
        this.currentClassName = classes[0].base_class;
        this.selectedClassName = classes[0].class_name
        this.streamId = classes[0].id;
        this.storageGetStream(this.streamId);
      } else { this.emptyClass = 'No classes available offline'; return this.loader = false; }
    });
  }

  async storageGetStream(id) {
    return await this.storage.get(`stream_${id}`).then(stream => {
      if (stream) {
        stream.students.length > 0 ? this.emptyClass = '' : this.emptyClass = 'This class has no learners';
        this.stream = stream.students;
        this.currentClassName = stream.base_class;
        this.selectedClassName = stream.class_name

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
        this.selectedClassName = res.data.class_name
      }
    });

    return await popover.present();
  }

  gotoreason(student) {
    const dataToPush = `${student.id}_${student.first_name}_${this.streamId}_${student.gender}`;
    this.router.navigate(['tabs/students/delete-reason', { details: dataToPush }]);
  }

  gotoaddstudents() {
    const toPass = `add_${this.streamId}`;
    this.router.navigate(['tabs/students/add-student', { data: toPass }]);
  }

  gotoeditstudent(student) {
    const toPass = `edit_${this.streamId}_${student.id}`;
    // console.log(toPass)
    this.router.navigate(['tabs/students/add-student'], { state: student });
  }

}
