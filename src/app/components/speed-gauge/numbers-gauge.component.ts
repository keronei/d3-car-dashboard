import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-mph-renderer',
  templateUrl: './mph-renderer.component.html',
  styleUrls: ['./mph-renderer.component.css'],
})
export class MphRendererComponent {
    @Input() mph: number = 51; // Example state value

  // Function to generate class names based on the current MPH value
  getMPHData() {
    let hundredsClass = 'mph__number mph__number';
    let tensClass = 'mph__number mph__number';
    let onesClass = 'mph__number mph__number';

    let hundredsDigit = '';
    let tensDigit = '';
    let onesDigit = (this.mph % 10).toString();

    if (this.mph > 100) {
      hundredsDigit = (this.mph + '')[0];
      tensDigit = (this.mph + '')[1];
      onesDigit = (this.mph % 10).toString();
    } else if (this.mph > 9) {
      tensDigit = (this.mph + '')[0];
      onesDigit = (this.mph % 10).toString();
    }

    return {
      hundredsClass: hundredsClass + '--' + hundredsDigit,
      tensClass: tensClass + '--' + tensDigit,
      onesClass: onesClass + '--' + onesDigit,
      hundredsDigit,
      tensDigit,
      onesDigit
    };
}
}
