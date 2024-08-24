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
          <!-- <app-info-map></app-info-map>
          <app-info-bottom></app-info-bottom> -->
          <app-rpm-gauge [value]="rpm"></app-rpm-gauge>
          <app-speed-gauge [value]="speed"></app-speed-gauge>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  sub = new Subscription();
  acc = false;
  rpm = 1700;
  speed = 112;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {

    this.socketService.getGpioData().subscribe((receivedMessage: any) => {
      console.log("Message:" + receivedMessage.rpm);
      this.rpm = receivedMessage.rpm;
      this.speed = receivedMessage.speed
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

    // const interval$ = interval(DEFAULT_REFRESH_RATE)
    //   .pipe(
    //     timeInterval(),
    //     tap(() => {

    //       if (this.acc) {
    //         this.speed = this.speed < 200 ? this.speed += 1 : this.speed;
    //         this.rpm = this.rpm < 6000 ? this.rpm += 50 : this.rpm;

    //         if(this.speed == 200){
    //           this.acc = false
    //         }

    //       } else {
    //         this.speed = this.speed > 20 ? this.speed -= 1 : this.speed;
    //         this.rpm = this.rpm > 700 ? this.rpm -= 30 : this.rpm;

    //         if (this.rpm < 700){
    //           this.acc = true;
    //         }
    //       }
    //     })
    //   );

    this.sub.add(keyDown$.subscribe());
    this.sub.add(keyUp$.subscribe());
    // this.sub.add(interval$.subscribe());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
