import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { arc, easeCubicInOut, line, range, scaleLinear, select, Selection, transition } from 'd3';
import { DEFAULT_REFRESH_RATE } from '../../shared/const';
import { degToRad, scale } from '../../shared/helpers';

@Component({
  selector: 'app-rpm-gauge',
  template: `<div class="rpm-gauge"></div>`
})
export class RpmGaugeComponent implements OnInit, OnChanges {
  @Input() rpm: number = 0;
  @Input() speed: number = 0;

  private needle!: Selection<SVGPathElement, number[][], null, undefined>;

  constructor(private readonly elementRef: ElementRef) { }

  ngOnInit(): void {
    this.generate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.needle) {
      return;
    }

    this.setValue(this.rpm, DEFAULT_REFRESH_RATE);
  }

  private generate(): void {
    const el = this.elementRef.nativeElement.querySelector('.rpm-gauge');
    const svg = select(el).append('svg').attr('width', '100%').attr('height', '100%');
    const g = svg.append('g').attr('transform', `translate(300, 300)`);
    const colors = ['#D1D1D1', '#AFAFAF', '#FFFFFF', '#FD3104', '#171717', '#0A0A0A'];
    const ticksData = [
      { value: 0 },
      { value: 10 },
      { value: 20 },
      { value: 30 },
      { value: 40 },
      { value: 50 },
      { value: 60 },
      { value: 70 },
      { value: 80 }
    ];
    const r = 300; // width / 2

    // gradients
    const defs = svg.append('defs');

    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gradient1')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '50%')
      .attr('y2', '100%');
    gradient.append('stop').attr('offset', '50%').attr('stop-color', colors[4]).attr('stop-opacity', 1);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', colors[5]).attr('stop-opacity', 1);

    // outer circle
    const outerRadius = r - 10;
    const innerRadius = 0;

    const circle = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', circle as any)
      .attr('fill', 'url(#gradient1)')
      .attr('stroke', colors[1])
      .attr('stroke-width', '8');

    // ticks
    const lg = svg.append('g').attr('class', 'label').attr('transform', `translate(${r}, ${r})`);
    const minAngle = -160;
    const maxAngle = 90;
    const angleRange = maxAngle - minAngle;

    const ticks = ticksData
      .reduce((acc, curr, i) => {
        if (curr.value === 0) {
          return acc;
        } else {
          return acc.concat(range(curr.value - 10, curr.value + 10));
        }
      }, [] as number[])
      .filter((d: number) => d % 2 === 0 && d <= 80);

    lg.selectAll('line')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'tickline')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d: number) => (d % 5 === 0 ? '12' : '7'))
      .attr('transform', (d: number) => {
        const scale = scaleLinear().range([0, 1]).domain([0, 80]);
        const ratio = scale(d);
        const newAngle = minAngle + ratio * angleRange;
        const deviation = d % 5 === 0 ? 12 : 17;
        return `rotate(${newAngle}) translate(0, ${deviation - r})`;
      })
      .style('stroke', (d: number) => (d >= 70 ? colors[3] : colors[2]))
      .style('stroke-width', (d: number) => (d % 5 === 0 ? '3' : '1'));

    // tick texts
    lg.selectAll('text')
      .data(ticksData)
      .enter()
      .append('text')
      .attr('transform', (d: { value: number }) => {
        const scale = scaleLinear().range([0, 1]).domain([0, 80]);
        const ratio = scale(d.value);
        const newAngle = degToRad(minAngle + ratio * angleRange);
        const y = (55 - r) * Math.cos(newAngle);
        const x = -1 * (52 - r) * Math.sin(newAngle);
        return `translate(${x}, ${y + 7})`;
      })
      .text((d: { value: number }) => (d.value !== 0 ? d.value / 10 : ''))
      .attr('fill', (d: { value: number }) => (d.value >= 70 ? colors[3] : colors[2]))
      .attr('font-size', '30')
      .attr('text-anchor', 'middle');

    // needle
    const pointerHeadLength = r * 0.88;
    const lineData = [
      [0, -pointerHeadLength],
      [0, 15]
    ];
    const needleLine = line();
    const ng = svg
      .append('g')
      .data([lineData])
      .attr('class', 'pointer')
      .attr('stroke', colors[3])
      .attr('stroke-width', '8')
      .attr('stroke-linecap', 'round')
      .attr('transform', `translate(${r}, ${r})`)
      .attr('z-index', '1');

    this.needle = ng.append('path').attr('d', needleLine as any).attr('transform', `rotate(${-160})`);

    // inner circle
    const tg = svg.append('g').attr('transform', `translate(${r}, ${r})`);

    const innerArcOuterRadius = r - 100;
    const innerArcInnerRadius = 0;

    const innerArc = arc()
      .innerRadius(innerArcInnerRadius)
      .outerRadius(innerArcOuterRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    tg.append('path')
      .attr('d', innerArc as any)
      .attr('stroke', colors[0])
      .attr('stroke-width', '4')
      .attr('fill', 'url(#gradient1)')
      .attr('z-index', '10');

    // big text in center
    tg.append('text')
      .text(`${this.speed}`)
      .attr('font-size', '200')
      .attr('text-anchor', 'middle')
      .attr('fill', colors[2])
      .attr('x', '0')
      .attr('y', '45px')
      .style('position', 'absolute')
      .style('z-index', '10');

    // rpm x 1000 text
    tg.append('text')
      .text('1/min x 1000')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('fill', colors[2])
      .attr('x', '0')
      .attr('y', '135px')
      .style('position', 'absolute')
      .style('z-index', '10');

    // lights icon
    tg.append('image')
      .attr('xlink:href', '/assets/images/lights.svg')
      .attr('x', '1px')
      .attr('y', '214px')
      .attr('width', '55px')
      .attr('height', '55px');

    // seat belt icon
    tg.append('image')
      .attr('xlink:href', '/assets/images/seat-belt.svg')
      .attr('x', '96px')
      .attr('y', '180px')
      .attr('width', '50px')
      .attr('height', '50px');

    // rear window defrost icon
    tg.append('image')
      .attr('xlink:href', '/assets/images/rear-window-defrost.svg')
      .attr('x', '185px')
      .attr('y', '110px')
      .attr('width', '50px')
      .attr('height', '50px');
  }

  private setValue(value: number, duration: number): void {
    const minAngle = -160;
    const maxAngle = 27.5;
    const angleRange = maxAngle - minAngle;
    const angle = minAngle + scale(value, 6000) * angleRange;
    console.log("Angle: "+ angle);
    
    transition()
      .select(() => this.needle.node())
      .duration(duration)
      .ease(easeCubicInOut)
      .attr('transform', `rotate(${angle})`);
  }
}
