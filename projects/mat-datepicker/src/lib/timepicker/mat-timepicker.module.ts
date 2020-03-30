import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatTimepickerComponent } from './mat-timepicker.component';
import { HoursSpinnerComponent } from './modal/hours-spinner/hours-spinner.component';
import { MinutesSpinnerComponent } from './modal/minutes-spinner/minutes-spinner.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
    exports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        MatIconModule,
        MatListModule
    ]
})
export class MaterialModule { }

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        DeviceDetectorModule.forRoot(),
        DragScrollModule
    ],
    declarations: [
        MatTimepickerComponent,
        ModalComponent,
        HoursSpinnerComponent,
        MinutesSpinnerComponent
    ],
    exports: [MatTimepickerComponent],
    bootstrap: [MatTimepickerComponent],
    providers: [],
    entryComponents: [ModalComponent]
}) export class MatTimepickerN3Module { }