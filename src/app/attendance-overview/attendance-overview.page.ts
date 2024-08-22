import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common-services/common.service';
import Chart from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'src/app/services/common-services/events';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-attendance-overview',
  templateUrl: './attendance-overview.page.html',
  styleUrls: ['./attendance-overview.page.scss'],
})
export class AttendanceOverviewPage implements OnInit {
  present: any;
  absent: any;
  pieData: any;
  user: any;
  pieDataReady = false;
  boysPresent: any;
  boysAbsent: any;
  stream: any
  _displayValue = "Learners"
  constructor(public activeRouter: ActivatedRoute, public navCtrl: NavController, public commonService: CommonService,
    public events: Events,
    public translateService: TranslateService) { }

  ngOnInit() {
    console.log("On int")
    this.getProfile();
    // this.drawPieChart();
    this.activeRouter.queryParams
      .subscribe(params => {
        this.events.publish('page:att_overview');
        if (Object.entries(params).length > 1) {
          this.boysPresent = params.boys_present;
          this.boysAbsent = params.boys_absent;
          this.present = params.present;
          this.absent = params.absent;
          this.stream = params.stream
          this.drawPieChart();
          this._displayValue = this.stream == "teachers" ? 'Teachers' : 'Learners'
        }
      });

  }

  get displayValue() {
    return this.translateService.get(this._displayValue)
  }

  async getProfile() {
    return await this.commonService.storageUserProfile().then(data => {
      this.user = data;
    });
  }

  async preparePieData() {
    // const snapData = this.activeRouter.snapshot.paramMap.get('data').split('_');  // present, absent
    // this.present = snapData[0];
    // this.absent = snapData[1];
    let present;
    let absent;
    await this.translateService.get('Present Learners').subscribe(value => present = value);
    await this.translateService.get('Absent Learners').subscribe(value => absent = value);
    const data = {
      labels: [present, absent],
      datasets: [{
        label: 'Daily Attendance Report',
        backgroundColor: [
          'rgba(32, 150, 243, 1)',
          'rgba(216,3,81,0.9)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        data: [this.present, this.absent],
        borderWidth: 0
      }]
    };

    return data;
  }

  async drawPieChart() {
    const normal = (document.getElementById('attendance-chart') as any).getContext('2d');
    // tslint:disable-next-line:no-unused-expression
    await new Chart(normal, {
      // The type of chart we want to create
      type: 'pie',

      // The data for our dataset
      data: await this.preparePieData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        legend: await this.legend(),
      }
    });
    // this.pieDataReady = true;
  }

  legend() {
    return {
      display: true,
      position: 'bottom',
      fullWidth: true,
      labels: {
        // This more specific font property overrides the global property
        fontFamily: '"Prompt-Medium", Helvetica, Arial, sans-serif',
        fontColor: 'black',
        padding: 30
      }
    };
  }

  gotoreasonforabsence() {
    this.navCtrl.navigateRoot('/tabs/absence-reason')
  }

}
