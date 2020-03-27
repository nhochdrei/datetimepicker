import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-hours-spinner',
  templateUrl: './hours-spinner.component.html',
  styleUrls: ['./hours-spinner.component.css']
})
export class HoursSpinnerComponent {

  @Output() hourChanged: EventEmitter<number> = new EventEmitter();

  _value: number;
  @Input() set value(val) {
    this.hourChanged.emit(val);
    this._value = val;
  }

  get value(): number {
    return this._value;
  }

  @Input() step: number;
  maximum = 24;


  @HostListener('wheel', ['$event'])
  public onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY > 0) {
      this.value = (this.value + (+this.step)) % this.maximum;
    } else if (event.deltaY < 0) {
      this.value = (this.value - this.step + this.maximum) % this.maximum;
    }
  }
}
