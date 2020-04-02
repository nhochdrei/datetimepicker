import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-minutes-spinner',
  templateUrl: './minutes-spinner.component.html',
  styleUrls: ['./minutes-spinner.component.css']
})
export class MinutesSpinnerComponent implements OnInit {

  @Output() minuteChanged: EventEmitter<number> = new EventEmitter();

  _value: number;
  @Input() set value(val) {
    this.minuteChanged.emit(val);
    this._value = val;
    // this.calculateClosestValue();
  }

  get value(): number {
    return +this._value;
  }

  @Input() step: number;
  maximum = 60;

  private sumDeltaY = 0;
  private lastDeltaY = 0;
  private stepSize = 40;
  intervalCenter = 0;
  firstTime = true;

  ngOnInit() {
    const values = [];
    for (let i = 0; i < 60; i++) {
      if (i % this.step === 0) {
        values.push(i);
      }
    }

    this._value = values.reduce((prev, curr) => {
      return (Math.abs(curr - this.value) < Math.abs(prev - this.value) ? curr : prev);
    });

  }

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
