import { TestBed } from '@angular/core/testing';

import { SchoolService } from './school.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonService } from '../common-services/common.service';


describe('SchoolService', () => {
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
    const service: SchoolService = TestBed.get(SchoolService);
    expect(service).toBeTruthy();
  });
});
