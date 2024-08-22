import { TestBed } from '@angular/core/testing';

import { AttendanceService } from './attendance.service';

import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from '../common-services/common.service';

describe('AttendanceService', () => {
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
    const service: AttendanceService = TestBed.get(AttendanceService);
    expect(service).toBeTruthy();
  });
});
