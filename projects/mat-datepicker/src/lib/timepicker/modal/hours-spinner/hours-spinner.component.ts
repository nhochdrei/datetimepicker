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
    return +this._value;
  }

  @Input() step: number;
  maximum = 24;

  private sumDeltaY = 0;
  private lastDeltaY = 0;
  private stepSize = 40;
  firstTime = true;

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

  dragStart(event) {
    const emptyImage = document.createElement('img');
    // emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    emptyImage.setAttribute('style',
      'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
    event.dataTransfer.setDragImage(emptyImage, 0, 0);


    // event.dataTransfer.effectAllowed = 'copyMove';
    // event.target.style.cursor = 'grab';

    event.target.style.cursor = 'grab';

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
