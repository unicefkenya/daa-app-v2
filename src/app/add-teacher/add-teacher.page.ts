import { Component, OnInit } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from '../services/common-services/common.service';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.page.html',
  styleUrls: ['./add-teacher.page.scss'],
})
export class AddTeacherPage implements OnInit {
  date: any;
  teacherForm: FormGroup;
  user: any;
  error = '';
  edit = false;
  teacherToEdit: any;
  classes: any;
  displayClasses = true;
  streamIds = [];
  constructor(private datePicker: DatePicker, formBuilder: FormBuilder, public commonService: CommonService, public storage: Storage,
    public activeRouter: ActivatedRoute, public events: Events, public navCtr: NavController) {

    this.teacherForm = formBuilder.group({
      first_name: new FormControl('', Validators.required),
      middle_name: new FormControl(''),
      last_name: new FormControl('', Validators.required),
      // gender: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      marital_status: new FormControl(''),
      email: new FormControl(''),
      tsc_no: new FormControl(''),
      streams: new FormControl(''),
      is_school_admin: new FormControl('false', Validators.required),
      qualifications: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.storageGetClasses();
    const id = this.activeRouter.snapshot.paramMap.get('id');
    if (id) { this.storageGetTeacher(id); this.edit = true; }
    this.getProfile();
  }

  isAdmin() {
    this.displayClasses ? this.displayClasses = false : this.displayClasses = true;
  }

  submitTeacherForm() {
    this.teacherForm.get('phone').setValue(this.teacherForm.value.phone.trim());
    if (!this.teacherForm.valid) { return this.error = 'Please fill in the form correctly'; }
    this.teacherForm.value.dob = moment(this.teacherForm.value.dob).format('YYYY-MM-DD');
    this.edit ? this.apiEditTeacher() : this.apiAddTeacher();
  }

  apiAddTeacher() {
    this.commonService.loaderPreset('Adding Teacher');
    this.teacherForm.value.school = this.user.school;
    const newTeacher = this.commonService.removeNullFields(this.teacherForm.value)
    this.commonService.generalPost(newTeacher, 'teachers').subscribe(data => {
      this.commonService.loaderDismiss();
      this.commonService.storageChangeSchoolOverview([{ action: 'add', teachers: 1 }]);
      this.commonService.storageAddItem(data, 'teachers');
      this.events.publish('teacher:created', data);
      this.navCtr.pop();
    }, error => {
      console.log(error);
      this.commonService.loaderDismiss();
      if (error.status === 0) { return this.commonService.generalAlert('Offline', 'You can only add a teacher when online'); }
      this.commonService.generalAlert('Error', 'An error occured please try again later');
    });

  }


  apiEditTeacher() {
    this.commonService.loaderPreset('Updating Teacher');
    this.teacherForm.value.school = this.teacherToEdit.school;
    const url = `teachers/${this.teacherToEdit.id}`;
    this.commonService.generalEdit(this.teacherForm.value, url).subscribe(data => {
      this.commonService.loaderDismiss();
      this.commonService.storageEditItem(data, 'teachers');
      this.events.publish('teacher:edited', data);
      this.navCtr.pop();
    }, error => {
      this.commonService.loaderDismiss();
      if (error.status === 0) { return this.commonService.generalAlert('Offline', 'You can only Edit a teacher when online'); }
      this.commonService.generalAlert('Error', 'An error occured please try again later');
    });
  }

  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      this.user = data;
    });
  }

  async storageGetTeacher(id) {
    return await this.storage.get('teachers').then(data => {
      this.teacherToEdit = data.find(t => t.id == id);
      if (this.teacherToEdit.is_school_admin) { this.displayClasses = false; }
      let date = moment(data.date_of_birth).format('LL');
      if (date === 'Invalid date') { date = ''; }
      this.teacherForm.setValue({
        first_name: this.teacherToEdit.first_name,
        middle_name: this.teacherToEdit.middle_name,
        last_name: this.teacherToEdit.last_name,
        // gender: this.teacherToEdit.gender,
        phone: this.teacherToEdit.phone,
        dob: date,
        marital_status: this.teacherToEdit.marital_status,
        email: this.teacherToEdit.email,
        tsc_no: this.teacherToEdit.tsc_no,
        streams: this.teacherToEdit.streams,
        is_school_admin: this.teacherToEdit.is_school_admin,
        qualifications: this.teacherToEdit.qualifications
      });
    });
  }

  pickDate() {
    this.datePicker.show({
      date: new Date(),
      maxDate: new Date().valueOf(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
    }).then(selectedDate => {
      const myDate = moment(selectedDate).format('LL');
      this.teacherForm.get('dob').setValue(myDate);
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  async storageGetClasses() {
    return await this.storage.get('classes').then(classes => {
      this.classes = classes;
    });
  }
}
