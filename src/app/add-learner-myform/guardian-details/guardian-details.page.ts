import { Component, OnInit, OnDestroy } from '@angular/core';
import { sStudentoptions } from '../options';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common-services/common.service';
import { Events } from 'src/app/services/common-services/events';
import { NetworkService } from 'src/app/services/network-status/network.service';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-guardian-details',
  templateUrl: './guardian-details.page.html',
  styleUrls: ['./guardian-details.page.scss'],
})
export class GuardianDetailsPage implements OnInit, OnDestroy {

  formItems: any = sStudentoptions;
  url: string = "api/v1/students/"
  extra_fields: any
  originalInstance: any
  formGroupOrder = [
    ['guardian_name'],
    ['guardian_phone'],
    ['guardian_status'],
    ['guardian_county'],
    ['guardian_sub_county'],
  ]
  instance: any;
  isValidationOnly: boolean = false
  hasInternet = false
  disConnectSub: any;
  connectSub: any;

  constructor(private route: ActivatedRoute, private router: Router,
    public navCtr: NavController, public events: Events,
    private storage: Storage,
    private network: Network,
    private networkService: NetworkService,
    public commonService: CommonService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.extra_fields = this.router.getCurrentNavigation().extras.state.form;
        const instance = this.router.getCurrentNavigation().extras.state.instance;
        this.originalInstance = instance
        this.instance = { ...instance, ...this.extra_fields }
      }
    });
  }

  ngOnInit() {
    this.isValidationOnly = !this.networkService.hasInternet

    this.connectSub = this.networkService.internetStatus$.subscribe((status) => {
      console.log(`Internet ${status}`)
      this.isValidationOnly = !status
    })
    console.log(`Has Internet ${this.isValidationOnly}  ${this.networkService.hasInternet}`)
  }
  ngOnDestroy(): void {
    if (this.connectSub) this.connectSub.unsubscribe()
  }




  async onValidatedData(data: any) {
    // console.logSave the Data offline 
    console.log("Saving the data offline.")
    if (this.originalInstance) {
      this.commonService.presentToast("Failed, Seems you are offline.")

    } else {
      this.storageStudentsToSync(this.removeNullFields(data))
      this.commonService.generalAlert("Student Saved offline", "Student will appear in the class list once you have an internet connection..")
    }
    await this.navCtr.navigateBack("/tabs/students");
  }

  async storageStudentsToSync(offlineData) {
    await this.storage.get('students_to_sync').then(async data => {
      if (data) {
        data.offline_data.push(offlineData);
        await this.storage.set('students_to_sync', data);
      } else {
        const dt = [];
        dt.push(offlineData);
        const sync = {
          offline_data: dt,
          failed: 0
        }
        await this.storage.set('students_to_sync', sync);
      }
    });
  }

  async onPostedData(data) {
    if (this.originalInstance) {
      this.onUpdateStudent(data)
    } else {
      this.onAddStudent(data)
    }
    await this.navCtr.navigateBack("/tabs/students");
  }

  removeNullFields(data) {
    const cleanData = {}
    for (const key in data) {
      if (data[key] !== null) {
        cleanData[key] = data[key]
      }
    }
    return cleanData
  }

  onAddStudent(data) {
    data.attendance = false;
    this.commonService.storageAddStudentToStream(data, `stream_${data.stream}`);
    data.gender == 'M' ? this.commonService.storageChangeSchoolOverview([{ action: 'add', M: 1 }]) : this.commonService.storageChangeSchoolOverview([{ action: 'add', F: 1 }]);
    this.events.publish('student:created', data)
  }
  onUpdateStudent(data) {
    this.commonService.storageEditStudentInStream(data, `stream_${data.stream}`);
    this.events.publish('student:edit', data);
    // update gender on local storage (overview) if gender is edited
    if (this.originalInstance.gender !== data.gender) {
      if (data.gender == 'M') {
        this.events.publish('gender:edited', data);
        this.commonService.storageChangeSchoolOverview([{ action: 'add', M: 1 }, { action: 'delete', F: 1 }]);
      } else {
        this.events.publish('gender:edited', data);
        // this.commonService.storageChangeSchoolOverview([{ action: 'delete', M: 1 }, { action: 'add', F: 1 }]);
      }
    }

    // change student class if class is edited
    if (Number(this.originalInstance.stream) !== Number(data.stream)) {
      this.commonService.storageRemoveStudentFromStream(data, `stream_${this.originalInstance.stream}`);
      this.commonService.storageAddStudentToStream(data, `stream_${data.stream}`);
      this.events.publish('student:moved', data);
    }
  }


}
