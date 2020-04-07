import { AfterViewInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Component({
  selector: 'mat-n3-timepicker',
  templateUrl: './mat-timepicker.component.html',
  styleUrls: ['./mat-timepicker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatTimepickerComponent),
    multi: true
  }]
})
export class MatTimepickerComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  @Input() disabled = false;
  @Input() okButton = 'OK';
  @Input() cancelButton = 'ABBRECHEN';

  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter<Date>();

  // tslint:disable-next-line: variable-name
  private _value = '';
  get value() { return this._value; }
  set value(v: string) {
    this.updateState(v);
    if (this.maskInput) {
      this.maskInput.element.nativeElement.value = v;
    }
  }

  private _hour = 0;
  get hour() { return this._hour; }
  set hour(h: number) {
    this._hour = h;
    this.sendTime();
  }

  private _minute = 0;
  get minute() { return this._minute; }
  set minute(m: number) {
    this._minute = m;
    this.sendTime();
  }

  @ViewChild('maskInput', { read: ViewContainerRef }) public maskInput: ViewContainerRef;
  private mask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/];
  private maskedInputController: any;

  private propagateChange;

  isDesktopDevice = false;
  menuVisible = false;

  constructor(
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isDesktopDevice = this.deviceService.isDesktop();
    if (this.value !== undefined && this.value.length > 1) { // todo prüfen ob update state reicht
      this.hour = +(this.value.substring(0, this.value.indexOf(':')));
      this.minute = +(this.value.substring(this.value.indexOf(':') + 1, this.value.length));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskInput.element.nativeElement.value = this.value;
      this.maskedInputController = textMask.maskInput({
        inputElement: this.maskInput.element.nativeElement,
        mask: this.mask
      });
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

  sendTime() {
    this.value = (this._hour.toString().length === 1 ? '0' + this._hour : this._hour)
      + ':' + (this._minute.toString().length === 1 ? '0' + this._minute : this._minute);
    this.updateValue();
  }

  updateValue() {
    this.updateState(this.maskInput.element.nativeElement.value);
    const time = moment(this.value, 'HH:mm');
    if (this.propagateChange) {
      this.propagateChange(time.toDate());
    }
    this.change.emit(time.toDate());
  }

  updateState(v: string) {
    this._value = v;
    this._hour = +v.substring(0, v.indexOf(':')).replace('_', '');
    this._minute = +v.substring(v.indexOf(':') + 1, v.length).replace('_', '');
  }

  maskInputClicked() {
    const input = this.maskInput.element.nativeElement;
    const text: string = input.value;

    if (text.indexOf(':') < input.selectionStart) {
      input.setSelectionRange(text.indexOf(':') + 1, text.length);
    } else {
      input.setSelectionRange(0, text.indexOf(':'));
    }
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event) {
    const input = this.maskInput.element.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const step = event.deltaY > 0 ? 1 : -1;
    const isHours = input.value.indexOf(':') > input.selectionStart;

    if (isHours) {
      this.hour = ((this.hour + step) + 24) % 24;
    } else {
      this.minute = ((this.minute + step) + 60) % 60;
    }

    this.sendTime();
    input.setSelectionRange(start, end);
  }

  onArrowPressed(event, isArrowUp: boolean) {
    event.preventDefault();

    const input = this.maskInput.element.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const step = isArrowUp ? 1 : -1;
    const isHours = input.value.indexOf(':') > input.selectionStart;

    if (isHours) {
      this.hour = ((this.hour + step) + 24) % 24;
    } else {
      this.minute = ((this.minute + step) + 60) % 60;
    }

    this.sendTime();
    input.setSelectionRange(start, end);
  }

  // Control Value Accessor Methods
  writeValue(obj: any): void {
    this.value = moment(obj).format('HH:mm');
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  // Menu Open-Close Methods
  menuOpened() {
    this.menuVisible = true;
  }

  menuClosed() {
    this.menuVisible = false;
  }
}
