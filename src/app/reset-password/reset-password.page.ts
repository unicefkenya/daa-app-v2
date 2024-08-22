import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { options } from './options';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  formItems: any = options;
  url: string = "api/v1/users/reset-password/"
  extra_fields: any = {}
  originalInstance: any
  formGroupOrder = [
    ['reset_code'],
    ['new_password'],
    ['confirm_password'],
  ]
  data: any = { email: "" }
  constructor(public router: Router,
    private route: ActivatedRoute,
    public navCtr: NavController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data;
      }
    });

  }

  ngOnInit() {

  }
  async onPostedData(data) {
    await this.navCtr.navigateBack("/login");
  }

}
