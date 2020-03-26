import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DragScrollComponent } from 'ngx-drag-scroll';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() intervalMinutes: number;
  posibleIntervals = [2, 3, 5, 10, 15, 20, 30];
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  minutes: number[] = [15, 30, 45, 60];

  @ViewChild('navHours', { read: DragScrollComponent }) ds: DragScrollComponent;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    if (this.posibleIntervals.filter(e => e === this.intervalMinutes).length === 0) {
      this.intervalMinutes = 15;
    }
    this.minutes = this.generateMinutes();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generateMinutes(): number[] {
    this.minutes = [];
    let minute = 60;
    const part = 60 / (60 / this.intervalMinutes);
    while (minute > 0) {
      minute = minute - part;
      this.minutes.push(minute);
    }
    return this.minutes.reverse();
  }
}
