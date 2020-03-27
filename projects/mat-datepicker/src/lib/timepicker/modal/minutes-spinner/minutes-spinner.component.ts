import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-minutes-spinner',
  templateUrl: './minutes-spinner.component.html',
  styleUrls: ['./minutes-spinner.component.css']
})
export class MinutesSpinnerComponent {

  @Output() minuteChanged: EventEmitter<number> = new EventEmitter();

  _value: number;
  @Input() set value(val) {
    this.minuteChanged.emit(val);
    this._value = val;
  }

  get value(): number {
    return this._value;
  }

  @Input() step: number;
  maximum = 60;

  getMinutesBefore(value, position, step, maximum): any {
    const minute = (value - position * step + maximum) % maximum;
    return minute < 0 ? '' : minute;
  }

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
