import { TestBed } from '@angular/core/testing';

import { MatDatepickerService } from './mat-datepicker.service';

describe('MatDatepickerService', () => {
  let service: MatDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
