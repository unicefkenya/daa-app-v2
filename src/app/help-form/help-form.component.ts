import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common-services/common.service';
import { options } from './options';

@Component({
  selector: 'app-help-form',
  templateUrl: './help-form.component.html',
  styleUrls: ['./help-form.component.scss'],
})
export class HelpFormComponent implements OnInit {
  formItems: any = options;
  url: string = "api/v1/support-requests/"
  extra_fields: any
  originalInstance: any
  formGroupOrder = [
    ['name'],
    ['email'],
    ['phone'],
    ['subject'],
    ['body']
  ]
  data: any = {}

  constructor(public router: Router,
    private route: ActivatedRoute,
    public navCtr: NavController,
    public commonService: CommonService) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.data = this.router.getCurrentNavigation().extras.state.data;
        }
      })
     }

  ngOnInit() {
    this.getProfile()
  }

  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      this.extra_fields = {
        school: data.id
      }
    });
  }

  async onPostedData(data) {
    await this.navCtr.navigateBack("/help");
  }

}
