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
  // tslint:disable-next-line: variable-name
  private _value = '';
  get value() { return this._value; }
  set value(v: string) {
    this._value = v;
    this.hoursChanged(v.substring(0, v.indexOf(':')).replace('_', ''));
    this.minutesChanged(v.substring(v.indexOf(':') + 1, v.length).replace('_', ''));
  }

  @Input() label: string;
  @Input() disabled = false;
  @Input() okButton = 'OK';
  @Input() cancelButton = 'ABBRECHEN';

  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter<Date>();

  @ViewChild('maskInput', { read: ViewContainerRef }) public maskInput: ViewContainerRef;
  private mask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/];
  private maskedInputController: any;

  hour = 0;
  minute = 0;

  isDesktopDevice = false;

  private propagateChange;

  constructor(
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isDesktopDevice = this.deviceService.isDesktop();
    if (this.value !== undefined && this.value.length > 1) {
      this.hour = +(this.value.substring(0, this.value.indexOf(':')));
      this.minute = +(this.value.substring(this.value.indexOf(':') + 1, this.value.length));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskedInputController = textMask.maskInput({
        inputElement: this.maskInput.element.nativeElement,
        mask: this.mask
      });
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

  hoursChanged(hour: string) {
    hour = hour !== undefined ? hour : '0';
    this.hour = +hour;
  }

  minutesChanged(minute: string) {
    minute = minute !== undefined ? minute : '0';
    this.minute = +minute;
  }

  sendTime() {
    this.value = (this.hour.toString().length === 1 ? '0' + this.hour : this.hour)
      + ':' + (this.minute.toString().length === 1 ? '0' + this.minute : this.minute);
    this.updateValue();
  }

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

  @HostListener('click', ['$event'])
  onClick(domElement) {
    if (domElement.toElement.className.includes('mat-input-element')) {
      domElement.target.select();
    }
  }

  updateValue() {
    const time = moment(this.value, 'HH:mm');
    if (this.propagateChange) {
      this.propagateChange(time.toDate());
    }
    this.change.emit(time.toDate());
  }

}
