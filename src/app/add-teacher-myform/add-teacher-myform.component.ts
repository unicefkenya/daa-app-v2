import { Component, OnInit } from '@angular/core';
import { options } from './options';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common-services/common.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-add-teacher-myform',
  templateUrl: './add-teacher-myform.component.html',
  styleUrls: ['./add-teacher-myform.component.scss'],
})
export class AddTeacherMyformComponent implements OnInit {
  formItems: any = options;
  url: string = "api/v1/teachers/"
  extra_fields: any
  originalInstance: any
  formGroupOrder = [
    ['first_name'],
    ['middle_name'],
    ['last_name'],
    ['phone'],
    ['type'],
    ['tsc_no'],
    ['email'],
    ['dob'],
    ['is_school_admin'],
    ['streams']
  ]
  instance: any;
  constructor(private route: ActivatedRoute, private router: Router,
    public navCtr: NavController, public events: Events,
    public commonService: CommonService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        const instance = this.router.getCurrentNavigation().extras.state.instance;
        this.originalInstance = instance
        this.instance = { ...instance }
      }
    });
  }


  preSendData(data) {
    data["HsPresave"] = true
    return data
  }

  ngOnInit() {
    this.getProfile()
  }
  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      console.log(data)
      this.extra_fields = {
        school: data.id
      }
    });
  }


  onValidatedData(data: any) {
    console.log(data)
  }

  async onPostedData(data) {
    if (this.originalInstance) {
      this.onUpdateTeacher(data)
    } else {
      this.onAddTeacher(data)
    }
    await this.navCtr.navigateBack("/tabs/teachers");
  }
  onAddTeacher(data) {
    this.commonService.storageChangeSchoolOverview([{ action: 'add', teachers: 1 }]);
    this.commonService.storageAddItem(data, 'teachers');
    this.events.publish('teacher:created', data);
    this.navCtr.pop();
  }
  onUpdateTeacher(data) {
    this.commonService.storageEditItem(data, 'teachers');
    this.events.publish('teacher:edited', data);
    this.navCtr.pop();
  }

}
