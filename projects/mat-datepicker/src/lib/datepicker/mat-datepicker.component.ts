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

  @ViewChild('input', { read: ViewContainerRef }) public input;
  mask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  maskedInputController;

  isDesktopDevice = false;

  private _value = '';
  get value() { return this._value; }
  set value(v: string) {
    if (v !== this._value) {
      this._value = v;
      const date = moment(v).toDate(); // todo format berücksichtigen
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
        inputElement: this.input.element.nativeElement,
        mask: this.mask
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

  private propagateChange = (_: any) => { };

  writeValue(obj: any): void {
    this.value = moment(obj).format('DD.MM.YYYY');
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
}
