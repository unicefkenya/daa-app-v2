import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { streamsOptions } from './options';
import { CommonService } from '../services/common-services/common.service';

@Component({
  selector: 'app-add-class-myform',
  templateUrl: './add-class-myform.component.html',
  styleUrls: ['./add-class-myform.component.scss'],
})
export class AddClassMyformComponent implements OnInit {

  formItems: any = streamsOptions;
  url: string = "api/v1/streams/"
  extra_fields: any
  formGroupOrder = [
    ['base_class'],
    ['name'],
  ]
  instance: any

  ionViewWillEnter() {
    this.getProfile()

    console.log(`Getting the ionVIwe... students page`)
  }

  constructor(private route: ActivatedRoute,
    public navCtr: NavController,
    public commonService: CommonService,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        const instance = this.router.getCurrentNavigation().extras.state;
        if (instance.hasOwnProperty("id")) {
          this.instance = instance
        }
      }
    });
  }

  ngOnInit(): void {

  }

  onValidatedData(data: any) {
    this.router.navigate(["/guardian-details"], { state: { form: data, instance: this.instance } });
  }

  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      this.extra_fields = {
        school: data.id
      }
    });
  }


  async onPostedData(data) {
    console.log("dadmm")
    await this.navCtr.navigateBack("/tabs/classes");
  }


}
