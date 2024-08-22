import { TestBed } from '@angular/core/testing';

import { StudentsService } from './students.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from '../common-services/common.service';


describe('StudentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [

      HttpClientModule,
      RouterTestingModule,
      IonicModule
    ],
    providers: [
      CommonService,
    ],
  }));

  it('should be created', () => {
    const service: StudentsService = TestBed.get(StudentsService);
    expect(service).toBeTruthy();
  });
});
