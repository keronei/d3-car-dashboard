import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-display',
  template: `
    <div class="time-display">
      <div class="time">{{ time }}</div>
      <div class="date">{{ date }}</div>
  `,

})
export class TimeDisplayComponent implements OnInit, OnChanges {
  @Input() time: string = "07:00 AM";
  @Input() date: string = "October 14, 2024";  // You can modify this dynamically later.

  constructor() { }

  ngOnInit(): void {
    // You can add logic here if you want to update the time/date dynamically.
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Respond to input changes if necessary.
  }
}
