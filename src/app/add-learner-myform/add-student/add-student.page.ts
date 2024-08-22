import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sStudentoptions } from '../options';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
})
export class AddStudentPage implements OnInit {

  @ViewChild('myStudentsForm') myFormComponent;


  formItems: any = sStudentoptions;
  url: string = ""

  formGroupOrder = [
    ['first_name'],
    ['middle_name'],
    ['last_name'],
    ['upi'],
    ['admission_no'],
    ['status'],
    ['gender'],
    ['knows_dob'],
    ['age'],
    ['date_of_birth'],
    ['date_enrolled'],
    ['stream'],
    ['special_needs'],
    ['distance_from_school'],
    ['county'],
    ['sub_county'],
    ['village'],
    ['cash_transfer_beneficiary'],
  ]
  instance: any

  ionViewWillEnter() {
    console.log(`Getting the ionVIwe... students page`)
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        const instance = this.router.getCurrentNavigation().extras.state;
        if (instance.hasOwnProperty("id")) {
          this.instance = instance
        }
      }
    });
  }

  preSendData(data) {
    if (!data.knows_dob) {
      if (!isNaN(data.age)) {
        data["date_of_birth"] = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * (366 * parseInt(data.age)))).toISOString().split("T")[0]
      }
    }
    return data
  }

  ngOnInit(): void {
  }

  onValidatedData(data: any) {
    this.router.navigate(["/guardian-details"], { state: { form: data, instance: this.instance } });
  }

}
