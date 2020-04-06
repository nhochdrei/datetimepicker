import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatTimepickerComponent } from './mat-timepicker.component';
import { SpinnerComponent } from './modal/spinner/spinner.component';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        DeviceDetectorModule.forRoot(),
        DragScrollModule,

        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatMenuModule
    ],
    declarations: [
        MatTimepickerComponent,
        SpinnerComponent
    ],
    exports: [MatTimepickerComponent],
    bootstrap: [MatTimepickerComponent]
}) export class MatTimepickerN3Module { }
