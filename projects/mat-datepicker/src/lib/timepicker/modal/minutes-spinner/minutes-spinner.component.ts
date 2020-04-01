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
    return +this._value;
  }

  @Input() step: number;
  maximum = 60;

  private sumDeltaY = 0;
  private lastDeltaY = 0;
  private stepSize = 40;
  firstTime = true;

  getMinutesBefore(value, position, step, maximum): any {
    const minute = (value - position * step + maximum) % maximum;
    return minute < 0 ? '' : minute;
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY > 0) {
      this.nextItem();
    } else if (event.deltaY < 0) {
      this.prevItem();
    }
  }

  resetDrag() {
    this.sumDeltaY = 0;
    this.lastDeltaY = 0;
    this.firstTime = true;
  }

  drag(event) {
    if (this.firstTime) {
      this.lastDeltaY = event.screenY;
      this.firstTime = false;
    }

    this.sumDeltaY += event.screenY - this.lastDeltaY;
    this.lastDeltaY = event.screenY;

    if (this.sumDeltaY >= this.stepSize) {
      this.sumDeltaY -= this.stepSize;
      this.prevItem();
    } else if (this.sumDeltaY <= -this.stepSize) {
      this.sumDeltaY += this.stepSize;
      this.nextItem();
    }
  }

  prevItem(): number {
    return this.value = (this.value - (+this.step) + this.maximum) % this.maximum;
  }

  nextItem(): number {
    return this.value = (this.value + (+this.step)) % this.maximum;
  }

  elementClicked(event) {
    this.value = event.target.innerHTML;
    event.stopPropagation();
  }

}
