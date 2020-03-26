import { AfterViewInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';
import { ModalComponent } from './modal/modal.component';

interface DialogData {
  email: string;
}

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
  @Input() placeholder: string;

  @Output() timeChanged = new EventEmitter<Date>();

  @ViewChild('input', { read: ViewContainerRef }) public input;
  mask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/];
  maskedInputController;

  isDesktopDevice = false;

  private _value = '';
  get value() { return this._value; }
  set value(v: string) {
    if (v !== this._value) {
      this._value = v;
      const date = moment(v).toDate();
      this.propagateChange(date);
      this.timeChanged.emit(date);
    }
  }

  email: string;

  constructor(
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      height: '350px',
      data: {
        hour: 10,
        minute: 30
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
      console.log(this.email);
    });
  }

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
