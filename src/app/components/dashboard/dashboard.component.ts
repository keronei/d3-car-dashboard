import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, fromEvent, interval, Subscription, tap, timeInterval } from 'rxjs';
import { DEFAULT_REFRESH_RATE } from '../../shared/const';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div class="dashboard-body">
        <div class="container">
          <!-- <app-info-top></app-info-top>
          <img src="/assets/images/map.png" class="map" /> -->
          <!-- <app-info-map></app-info-map>-->
          <app-info-bottom [fuelDistance]="fuelDistance" [fuelLitres]="fuelLitres" [trip]="trip"></app-info-bottom> 
          <app-rpm-gauge [rpm]="rpm" [speed]="speed"></app-rpm-gauge>
          <app-time-display [date] = "date" [time] = "time"></app-time-display>
          <app-fuel-display [percentage] = "percentage" ></app-fuel-display>
          <!-- <app-speed-gauge [value]="speed"></app-speed-gauge> -->
           <!-- <app-mph-renderer [mph]="89"></app-mph-renderer> -->
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  sub = new Subscription();
  acc = false;
  rpm = 1700;
  speed = 0;
  date = "Saturday, 12/10";
  time = "0011";
  percentage = 0;
  fuelDistance = 0;
  fuelLitres = 0;
  trip = 0;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {

    this.socketService.getGpioData().subscribe((receivedMessage: any) => {
      console.log("Message:" + receivedMessage.rpm);
      this.rpm = receivedMessage.rpm;
      this.speed = receivedMessage.speed;
      this.time = receivedMessage.time;
      this.date = receivedMessage.day +", "+receivedMessage.date;
      this.percentage = receivedMessage.fuelPercentage;
      this.fuelDistance = receivedMessage.fuelDistance;
      this.fuelLitres = receivedMessage.fuelLitres;
      this.trip = receivedMessage.trip;
    });

    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e: KeyboardEvent) => e.key === 'ArrowUp'),
        tap(() => this.acc = true)
      );

    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.key === 'ArrowUp'),
        tap(() => this.acc = false)
      );


    this.sub.add(keyDown$.subscribe());
    this.sub.add(keyUp$.subscribe());
    // this.sub.add(interval$.subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
