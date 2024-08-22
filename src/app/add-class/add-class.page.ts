import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-services/common.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.page.html',
  styleUrls: ['./add-class.page.scss'],
})
export class AddClassPage implements OnInit {
  classForm: FormGroup;
  classes: any;
  user: any;
  error = '';
  edit = false;
  classToEdit: any;

  constructor(public commonService: CommonService, public navCtr: NavController, public formBuilder: FormBuilder,
    public events: Events, public storage: Storage, public activeRouter: ActivatedRoute) {
    this.classes = [{ name: '1', id: 1 }, { name: '2', id: 2 }, { name: '3', id: 3 }, { name: '4', id: 4 }, { name: '5', id: 5 },
    { name: '6', id: 6 }, { name: '7', id: 7 }, { name: '8', id: 8 },];
    this.classForm = formBuilder.group({
      base_class: new FormControl('', Validators.required),
      name: new FormControl(''),
    });
  }

  ngOnInit() {
    const snapData = this.activeRouter.snapshot.paramMap.get('id');
    console.log(`SnapData ${snapData}`)
    if (snapData) { this.storageGetClass(snapData); this.edit = true; }
    this.getProfile();
  }
  ionViewWillEnter() {
    const snapData = this.activeRouter.snapshot.paramMap.get('id');
    if (snapData) { this.storageGetClass(snapData); this.edit = true; }
    this.getProfile();
  }

  getBaseClasses() {

  }

  submitClassForm() {
    if (!this.classForm.valid) { return this.error = 'Please fill in all the fields'; }
    this.edit ? this.apiEditClass() : this.apiAddClass();

  }

  apiAddClass() {
    this.classForm.value.school = this.user.school;
    this.commonService.loaderPreset('Adding Class');
    this.commonService.generalPost(this.classForm.value, 'streams').subscribe(data => {
      data.female_students = 0;
      data.male_students = 0;
      this.storageAddClass(data);
      this.storageAddStream(data);
      this.events.publish('class:created', data);
      this.commonService.storageChangeSchoolOverview([{ action: 'add', classes: 1 }]);
      this.commonService.loaderDismiss();
      this.navCtr.pop();
    },
      error => {
        console.log(error)
        this.commonService.loaderDismiss();
        if (error.error.name) { return this.error = 'Stream already exists'; }
        if (error.status === 0) { return this.error = `You can't perform this operation offline`; }
        this.error = 'An Error Occured. Please Try Again Later"';
      });
  }

  apiEditClass() {
    console.log("Editing....")
    this.commonService.loaderPreset('Updating');
    this.classForm.value.school = this.user.school;
    const url = `streams/${this.classToEdit.id}`;
    this.commonService.generalEdit(this.classForm.value, url).subscribe(data => {
      data.female_students = this.classToEdit.female_students;
      data.male_students = this.classToEdit.male_students;
      this.commonService.storageEditItem(data, 'classes');
      this.storageEditstream(data);
      this.events.publish('class:edited', data);
      this.commonService.loaderDismiss();
      this.navCtr.pop();
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.error.name) { return this.error = 'Stream already exists'; }
        if (error.status === 0) { return this.error = `You can't perform this operation offline`; }
        this.error = 'An Error Occured. Please Try Again Later"';
      });
  }

  async storageAddStream(data) {
    data.students = [];
    return await this.storage.set(`stream_${data.id}`, data);
  }

  async storageAddClass(data) {
    return await this.storage.get('classes').then(classes => {
      if (classes.length > 0) {
        classes.push(data);
        this.storage.set('classes', classes);
      } else { this.storage.set('classes', [data]); }
    });
  }

  async storageEditstream(data) {
    return await this.storage.get(`stream_${this.user.school}`).then(stream => {
      stream.base_stream = data.base_stream;
      stream.name = data.name;
      this.storage.set(`stream_${this.user.school}`, stream);
    });
  }

  async storageGetClass(id) {
    this.storage.get('classes').then(data => {
      this.classToEdit = data.filter(cl => cl.id == id)[0];
      this.classToEdit.name ? '' : this.classToEdit.name = '';
      this.classForm.setValue({
        base_class: this.classToEdit.base_class,
        name: this.classToEdit.name,
      });
    });
  }

  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      this.user = data;
    });
  }
}
