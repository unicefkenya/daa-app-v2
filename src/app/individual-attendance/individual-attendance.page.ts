import { Component, OnInit, Input } from '@angular/core';
import { StudentsService } from '../services/students-service/students.service';
import { CommonService } from '../services/common-services/common.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-individual-attendance',
  templateUrl: './individual-attendance.page.html',
  styleUrls: ['./individual-attendance.page.scss'],
})
export class IndividualAttendancePage implements OnInit {

  report: any;
  probability: any;
  test: string;
  resolved = false;
  student: any;
  noReport: string;
  mainStud: any;

  constructor(private studentsService: StudentsService, private commonService: CommonService,
    private router: Router, private navCtrl: NavController, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.mainStud = this.router.getCurrentNavigation().extras.state.student
      console.log(this.mainStud)
    }
    this.student = this.activatedRoute.snapshot.paramMap.get('params').split('_');

    this.probability = this.getDropoutProbability(this.student[0]);
    this.getMonthlyStudentAttendanceSummary(this.student[0]);
  }

  // todo: move function
  getMonthlyStudentAttendanceSummary(studentId) {
    this.noReport = '';
    this.commonService.loaderPreset('loading');
    const start = moment().subtract(2, 'weeks').startOf('W').format('YYYY-MM-DD');
    const query = `weekly?student=${studentId}&start_date=${start}`;
    return this.studentsService.getStudentAttendanceSummary(query).subscribe(res => {
      this.commonService.loaderDismiss();
      if (res.results.length < 1) { return this.noReport = `Learner has no attendance record!`; }
      this.report = this.prepareReport(res.results);
      return this.resolved = true;
    },
      error => {
        this.commonService.loaderDismiss();
      });
  }

  prepareReport(data: any) {
    const labels: any = [];
    const presents: any = [];
    const absents: any = [];
    data.map(dt => {
      labels.push(moment(dt.value).format('MMM D YYYY'));
      presents.push(dt.present);
      absents.push(dt.absent);
    });

    const report = {
      labels,
      presents,
      absents
    };
    return report;

  }

  getDropoutProbability(studentId) {
    const query = 'yearly?student=' + studentId;
    return this.studentsService.getDropoutProbability(query).subscribe(res => {
      const propability = this.attendancePercentage(res.results[0].present, res.results[0].total);

      return this.probability = {
        retention: propability.retention,
        dropout: propability.dropout
      };
    },
      error => {
        if (error.status === 0) {
          this.commonService.generalAlert('OFFLINE', `You can't perform this operation offline`);
          this.navCtrl.pop();
          return;
        }
      });
  }

  getList(details: any[]) {
    return details.map(d => d.name).join(", ")
  }

  attendancePercentage(present: number, total: number) {
    const retention = Math.round((present / total) * 100);
    const dropout = 100 - retention;

    const report = {
      retention,
      dropout
    };

    return report;
  }

}
