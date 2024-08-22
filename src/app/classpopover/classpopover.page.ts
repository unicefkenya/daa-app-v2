import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { CommonService } from '../services/common-services/common.service';
import { Events } from '../services/common-services/events';

@Component({
  selector: 'app-classpopover',
  templateUrl: './classpopover.page.html',
  styleUrls: ['./classpopover.page.scss'],
})
export class ClasspopoverPage implements OnInit {
  classes: any;
  isAdmin = false
  teacherObj = {
    base_class: "All ",
    name: "Teachers",
    id: "teachers"
  }
  constructor(public navParams: NavParams, public commonService: CommonService,
    public events: Events, private popoverController: PopoverController) {
    this.classes = navParams.get('classes');
  }
  getProfile() {
    return this.commonService.storageUserProfile().then(data => {
      this.isAdmin = data.is_school_admin ? true : false;
    });
  }
  ngOnInit() {
    this.getProfile()
  }

  ionWillEnter() {
    this.getProfile()
  }

  closePopOver(selectedClass) {
    this.popoverController.dismiss(selectedClass);
  }
}

