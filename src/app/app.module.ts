import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTimepickerN3Module } from 'projects/mat-datepicker/src/lib/timepicker/mat-timepicker.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTimepickerN3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
