import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateValidator } from 'projects/mat-datepicker/src/lib/validators/datepicker-validator';
import { TimeValidator } from 'projects/mat-datepicker/src/lib/validators/timepicker-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form = this.fb.group({
    time: [new Date(), [TimeValidator]],
    date: [new Date(), [DateValidator]]
  });

  date = new Date();

  get f() { return this.form.controls; }

  constructor(private fb: FormBuilder) { }


  type(t) {
    return t;
  }

}
