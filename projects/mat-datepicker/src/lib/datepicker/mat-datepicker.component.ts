import { AfterViewInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Component({
  selector: 'mat-n3-datepicker',
  templateUrl: './mat-datepicker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatDatepickerComponent),
    multi: true
  }]
})
export class MatDatepickerComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() label: string;

  @Output() dateChanged = new EventEmitter<Date>();

  @ViewChild('maskInput', { read: ViewContainerRef }) public maskInput;
  mask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  maskedInputController;

  isDesktopDevice = false;

  private _value: Date;
  get value() { return this._value; }
  set value(v: Date) {
    if (v !== this._value) {
      this._value = v;

      const date = moment(v).toDate();
      this.propagateChange(date);
      this.dateChanged.emit(date);
    }
  }

  constructor(
    private dateAdapter: DateAdapter<any>,
    private deviceService: DeviceDetectorService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskedInputController = textMask.maskInput({
        inputElement: this.maskInput.element.nativeElement,
        mask: this.mask,
        guide: true,
        keepCharPositions: true
      });
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

  ngOnInit(): void {
    this.isDesktopDevice = this.deviceService.isDesktop();
    this.dateAdapter.setLocale('de');
  }

  getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  maskInputClicked() {
    const input = this.maskInput.element.nativeElement;
    const text: string = input.value;

    if (text.indexOf('.') > input.selectionStart) {
      input.setSelectionRange(0, text.indexOf('.'));
    } else if (text.indexOf('.') < input.selectionStart && this.getPosition(text, '.', 2) >= input.selectionStart) {
      input.setSelectionRange(text.indexOf('.') + 1, this.getPosition(text, '.', 2));
    } else {
      input.setSelectionRange(this.getPosition(text, '.', 2) + 1, text.length);
    }
  }

  @HostListener('wheel', ['$event'])
  public onScroll(e) {
    const input = this.maskInput.element.nativeElement;
    const text: string = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const step = e.deltaY > 0 ? 1 : -1;
    const isDays = text.indexOf('.') > input.selectionStart;
    const isMonth = text.indexOf('.') < input.selectionStart && this.getPosition(text, '.', 2) >= input.selectionStart;
    const isYear = isDays === false && isMonth === false;
    let date: moment.Moment = moment(text, 'DD.MM.YYYY');

    if (isDays) { date = date.add(step, 'day'); }
    if (isMonth) { date = date.add(step, 'month'); }
    if (isYear) { date = date.add(step, 'year'); }

    this.changeInputValue(date, e, start, end);
    this.propagateNewValue(date.toString(), e);
  }

  key(e) {
    const input = this.maskInput.element.nativeElement;
    const text: string = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const isDays = text.indexOf('.') > input.selectionStart;
    const isMonth = text.indexOf('.') < input.selectionStart && this.getPosition(text, '.', 2) >= input.selectionStart;
    const isYear = isDays === false && isMonth === false;
    let date: moment.Moment = moment(text, 'DD.MM.YYYY');

    if (e.code === 'ArrowUp') {
      if (isDays) { date = date.add(1, 'day'); }
      if (isMonth) { date = date.add(1, 'month'); }
      if (isYear) { date = date.add(1, 'year'); }

      this.changeInputValue(date, e, start, end);
      this.propagateNewValue(date.toString(), e);
      return false;

    } else if (e.code === 'ArrowDown') {
      if (isDays) { date = date.subtract(1, 'day'); }
      if (isMonth) { date = date.subtract(1, 'month'); }
      if (isYear) { date = date.subtract(1, 'year'); }

      this.changeInputValue(date, e, start, end);
      this.propagateNewValue(date.toString(), e);
      return false;

    } else if ('0123456789'.includes(e.key)) {
      let p = e.target.selectionStart;
      let next = e.target.value.slice(p, p + 1);
      if (next === '.') {
        p++;
        next = e.target.value.slice(p, p + 1);
      }

      if (next !== '' && '0123456789'.includes(next) && e.target.selectionStart === e.target.selectionEnd) {
        e.target.value = e.target.value.slice(0, p) + e.key + e.target.value.slice(p + 1);
        e.target.selectionStart = e.target.selectionEnd = p + 1;

        this.propagateNewValue(date.toString(), e);
        return false;
      }
    }

  }

  changeInputValue(date: moment.Moment, e: any, start: number, end: number) {
    e.target.value = date.format('DD.MM.YYYY');
    e.target.selectionStart = start;
    e.target.selectionEnd = end;
  }

  propagateNewValue(value: string, e: any) {
    const date = moment(value).toDate();
    this.propagateChange(date);
    this.dateChanged.emit(date);
  }

  private propagateChange = (_: any) => { };

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }
}
