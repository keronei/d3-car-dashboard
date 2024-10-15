import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-fuel-display',
  template: `
    <div class="fuel-display">
      <div class="progress-container">
        <div class="progress-bar" [style.height.%]="percentage"></div>
      </div>
      <div class="percentage-label">{{ percentage }}%</div>
    </div>
  `,

})
export class FuelDisplayComponent implements OnInit, OnChanges {
@Input() percentage: number = 0.3;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Respond to input changes if necessary.
  }
}
