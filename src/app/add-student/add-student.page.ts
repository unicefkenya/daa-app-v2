import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { CommonService } from '../services/common-services/common.service';
import { SchoolService } from '../services/school-service/school.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MoeService } from '../services/moe-service/moe-service.service';
import * as moment from 'moment';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { Events } from 'src/app/services/common-services/events';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
})
export class AddStudentPage implements OnInit {
  processForm: FormGroup;
  error: string;
  streams: any;
  testStream: any;
  success: string;
  snapData: any;
  edit = false;
  currentStudent: any;
  states: any;
  blood_groups: any;
  regions: any;
  sections: any;
  districts: any;
  constructor(public alertController: AlertController, private storage: Storage, public events: Events,
    public formBuilder: FormBuilder, public commonService: CommonService, public schoolService: SchoolService,
    public activeRouter: ActivatedRoute, public navCtr: NavController, private datePicker: DatePicker, private moeService: MoeService) {

    this.processForm = formBuilder.group({
      first_name: new FormControl('', Validators.required),
      middle_name: new FormControl(''),
      last_name: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', Validators.required),
      stream: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      guardian_status: new FormControl('', Validators.required),
      special_needs: new FormControl('', Validators.required),
      admission_no: new FormControl('', Validators.required),
      guardian_phone: new FormControl(''),

      //MOE fields
      state_id: new FormControl(''),
      district_id: new FormControl(''),
      blood_group_id: new FormControl(''),
      region_id: new FormControl(''),
      // section_id: new FormControl('', Validators.required),
      guardian_name: new FormControl('', Validators.required),
      distance_from_school: new FormControl('', Validators.required)
    });

    this.testStream = [{ id: 1, name: '1A' }, { id: 2, name: '2A' }, { id: 3, name: '3A' }];
  }

  ngOnInit() {
    let snapData: any = this.activeRouter.snapshot.paramMap.get('data');  // action,stream_id, student_id
    if (snapData) {
      snapData = snapData.split('_');
      if (snapData[0] === 'add') { this.addUserForm(snapData[1]); }
      if (snapData[0] === 'edit') { this.edituserForm(snapData[2], snapData[1]); this.edit = true; }
    }
    this.storageGetClasses();

    //TODO:Transfer call to getGeneral on Common Service
    this.moeService.getStates().subscribe((res) => { this.states = res.data });
    this.moeService.getBloodGroups().subscribe((res) => { this.blood_groups = res.data });
    this.moeService.getRegions().subscribe((res) => { this.regions = res.data });
    // this.moeService.getSections().subscribe((res) => { this.sections = res.data });
    // this.moeService.getDistricts().subscribe((res) => { this.districts = res.data });



    // this.commonService.storageChangeSchoolOverview([{ action: 'add', M: 1 }]);
    // this.commonService.storageChangeSchoolOverview([{ action: 'add', F: 1 }]);
  }

  submitProcessForm() {
    this.error = '';
    this.success = '';
    if (!this.processForm.valid) { return this.error = 'Please fill in all the fields'; }
    this.processForm.value.date_of_birth = moment(this.processForm.value.date_of_birth).format('YYYY-MM-DD');
    if (!this.edit) { this.addStudent(); }
    if (this.edit) { this.editStudent(); }
  }

  addStudent() {
    this.commonService.loaderPreset('Adding Student');
    this.processForm.value.date_enrolled = moment().format('YYYY-MM-DD');
    const url = `students`;

    //Assign moe_extra_info fields
    let moe_extra_info = {};
    ['guardian_name', 'distance_from_school', 'region_id', 'state_id', 'blood_group_id', 'district_id'].forEach(key => {
      console.log(this.processForm);
      moe_extra_info[key] = this.processForm.value[key];
      console.log(moe_extra_info);

    });

    console.log("MOE extra info", moe_extra_info);

    this.processForm.value.moe_extra_info = moe_extra_info;
    console.log(this.processForm.value);
    this.commonService.generalPost(this.processForm.value, url).subscribe(data => {
      this.commonService.loaderDismiss();
      data.attendance = false;
      this.commonService.storageAddStudentToStream(data, `stream_${data.stream}`);
      // tslint:disable-next-line:max-line-length
      this.processForm.value.gender == 'M' ? this.commonService.storageChangeSchoolOverview([{ action: 'add', M: 1 }]) : this.commonService.storageChangeSchoolOverview([{ action: 'add', F: 1 }]);
      this.events.publish('student:created', data);
      this.success = 'Student added successfully';
      this.addUserForm(this.processForm.value.stream);
      this.navCtr.pop();
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) {
          this.success = 'student will be created when you get online';
          this.navCtr.pop();
          this.commonService.generalAlert('OFFLINE', 'Data will be synced when you get online');
          return this.storageStudentsToSync();
        }
        console.log(error);
      });
  }

  editStudent() {
    this.commonService.loaderPreset('Updating Student');
    this.processForm.value.date_enrolled = moment(this.currentStudent.date_enrolled).format('YYYY-MM-DD');
    const url = `students/${this.currentStudent.id}`;
    this.commonService.generalEdit(this.processForm.value, url).subscribe(data => {
      this.commonService.loaderDismiss();
      this.commonService.storageEditStudentInStream(data, `stream_${this.processForm.value.stream}`);
      this.events.publish('student:edit', data);
      // update gender on local storage (overview) if gender is edited
      if (this.currentStudent.gender !== this.processForm.value.gender) {
        if (this.processForm.value.gender == 'M') {
          this.events.publish('gender:edited', data);
          this.commonService.storageChangeSchoolOverview([{ action: 'add', M: 1 }, { action: 'delete', F: 1 }]);
        } else {
          this.events.publish('gender:edited', data);
          // this.commonService.storageChangeSchoolOverview([{ action: 'delete', M: 1 }, { action: 'add', F: 1 }]);
        }
      }

      // change student class if class is edited
      if (Number(this.currentStudent.stream) !== Number(this.processForm.value.stream)) {
        this.commonService.storageRemoveStudentFromStream(data, `stream_${this.currentStudent.stream}`);
        this.commonService.storageAddStudentToStream(data, `stream_${this.processForm.value.stream}`);
        this.events.publish('student:moved', data);
      }

      this.success = 'Learner details successfully Updated';
      // this.processForm.reset();
      this.navCtr.pop();
    },
      error => {
        this.commonService.loaderDismiss();
        if (error.status === 0) { return this.error = 'You are offline. Can edit only when Online'; }
        this.error = 'An Error Occured. Please Try Again Later';
      });
  }


  async storageGetClasses() {
    return await this.storage.get('classes').then(async res => {
      if (res) {
        this.streams = res;
        return;
      }
    });
  }

  addUserForm(streamId) {
    this.processForm.setValue({
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '1997-10-10',
      stream: streamId,
      status: '',
      guardian_status: '',
      special_needs: '',
      admission_no: '',
      guardian_phone: '',

      //MOE fields
      state_id: '',
      district_id: '',
      blood_group_id: '',
      region_id: '',
      guardian_name: '',
      distance_from_school: ''
    });
  }

  async edituserForm(studentID, classId) {
    return await this.commonService.storageGetStudent(studentID, classId).then(data => {
      this.currentStudent = data;
      let date = moment(data.date_of_birth).format('LL');
      if (date === 'Invalid date') { date = ''; }
      this.processForm.setValue({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        gender: data.gender,
        date_of_birth: date,
        stream: classId,
        status: data.status,
        guardian_status: data.guardian_status,
        special_needs: data.special_needs,
        admission_no: data.admission_no,
        guardian_phone: data.guardian_phone,
        distance_from_school: data.distance_from_school,
        guardian_name: data.guardian_name,


        //MOE fields
        state_id: data.moe_extra_info.state_id,
        district_id: data.moe_extra_info.district_id,
        blood_group_id: data.moe_extra_info.blood_group_id,
        region_id: data.moe_extra_info.region_id,

      });
    });
  }

  async storageStudentsToSync() {
    await this.storage.get('students_to_sync').then(async data => {
      if (data) {
        data.offline_data.push(this.processForm.value);
        await this.storage.set('students_to_sync', data);
      } else {
        const dt = [];
        dt.push(this.processForm.value);
        const sync = {
          offline_data: dt,
          last_sync: moment().format('ddd, LL, hh:mm A'),
          failed: 0
        };
        this.navCtr.pop();
        await this.storage.set('students_to_sync', sync);
      }
      return;
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
      this.processForm.get('date_of_birth').setValue(myDate);
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }


  selectedRegion(e) {
    console.log(e.target.value);
    this.moeService.getDistricts(e.target.value).subscribe(response => {
      console.log(response);
      this.districts = response.data;
    }, err => {
      console.log(err);
    });
  }
  // getDropDownText(){

  // }

  getDistricts(event_data) {

  }

  getRegions(event_data) {

  }

}
