import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ClasspopoverPage } from '../classpopover/classpopover.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-deactivated-learners',
  templateUrl: './deactivated-learners.component.html',
  styleUrls: ['./deactivated-learners.component.scss'],
})
export class DeactivatedLearnersComponent implements OnInit {

  stream = [];
  currentStream: any;
  classes: any;
  streamId: any;
  search_student: any;
  currentClassName: any;
  loader: boolean;
  emptyClass: string;
  change = true;
  selectedClassName: any;

  constructor(public storage: Storage, public popoverController: PopoverController, public router: Router) { }

  ngOnInit() {}

  async storageGetClasses() {
    return await this.storage.get('classes').then(classes => {
      if (classes) {
        this.classes = classes;
        let streamId = this.streamId ? this.streamId : classes[0].id
        const currentStream = classes.find(cl => cl.id == streamId)
        this.currentStream = currentStream.name;
        this.currentClassName = currentStream.base_class;
        this.selectedClassName = currentStream.class_name
        this.streamId = currentStream.id;
        this.storageGetStream(this.streamId);
      } else { this.emptyClass = 'No classes available offline'; return this.loader = false; }
    });
  }

  async storageGetStream(id) {
    return await this.storage.get(`stream_${id}`).then(stream => {
      if (stream) {
        stream.students.length > 0 ? this.emptyClass = '' : this.emptyClass = 'This class has no learners';
        this.stream = stream.students;
        this.currentClassName = stream.base_class;
        this.selectedClassName = stream.class_name
        this.currentStream = stream.name;

      } else { this.emptyClass = 'No classes available offline'; return this.loader = false; }
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ClasspopoverPage,
      event: ev,
      translucent: true,
      componentProps: { classes: this.classes }
    });

    popover.onDidDismiss().then(res => {
      if (res.data === undefined) { return; }
      const id = res.data.id;
      if (String(id) !== String(this.streamId)) {
        this.streamId = id;
        this.storageGetStream(id);
        this.currentStream = res.data.name;
        this.currentClassName = res.data.base_class;
        this.selectedClassName = res.data.class_name
      }
    });

    return await popover.present();
  }


  gotoreason(){
    console.log('xxx')
    this.router.navigate(['tabs/reactivate-reason']);
  }

}
