import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Output() valueChange: EventEmitter<number> = new EventEmitter();

  @Input() step: number;
  @Input() max: number;
  @Input() min: number;

  _value: number;

  @Input()
  set value(val) {
    this._value = val;
  }

  get value(): number {
    return this._value;
  }

  private sumDeltaY = 0;
  private lastDeltaY = 0;
  private stepSize = 40;
  firstTime = true;

  ngOnInit() {
    this._value = Math.round(this.value / this.step) * this.step;
  }

  generateValueBefore(position: number): any {
    const minute = (this.value + position * +this.step + +this.max) % +this.min;
    return minute < 0 ? '' : minute;
  }

  @HostListener('wheel', ['$event'])
  onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY > 0) {
      this.prevItem();
    } else if (event.deltaY < 0) {
      this.nextItem();
    }
  }

  dragStart(event) {
    const emptyImage = document.createElement('img');
    emptyImage.setAttribute('style',
      'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
    event.dataTransfer.setDragImage(emptyImage, 0, 0);

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
      this.nextItem();
    } else if (this.sumDeltaY <= -this.stepSize) {
      this.sumDeltaY += this.stepSize;
      this.prevItem();
    }
  }

  updateValue(v: number) {
    this.value = v;
    this.valueChange.emit(v);
  }

  prevItem() {
    this.updateValue((this.value - (+this.step) + (+this.max)) % (+this.max));
  }

  nextItem() {
    this.updateValue((this.value + (+this.step)) % (+this.max));
  }

  generateValue(position): any {
    const item = (this.value - position * (+this.step) + (+this.max)) % (+this.max);
    return item < 10 ? '0' + item : item;
  }

  clicked(v: number, event: Event) {
    this.updateValue(v);
    event.stopPropagation();
  }
}
