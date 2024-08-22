import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { options } from './options';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  formItems: any = options;
  url: string = "api/v1/users/forgot-password/"
  extra_fields: any = {}
  originalInstance: any
  formGroupOrder = [
    ['username'],
  ]
  instance: any;
  constructor(public router: Router,
    public navCtr: NavController, ) { }

  ngOnInit() {
  }

  gotoResetPassword() {
    this.router.navigateByUrl('reset-password');
  }
  async onPostedData(data) {
    await this.navCtr.navigateBack("/reset-password", { state: { data: data } });
  }

}
