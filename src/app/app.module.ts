import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoBottomComponent } from './components/info-bottom/info-bottom.component';
import { InfoMapComponent } from './components/info-map/info-map.component';
import { InfoTopComponent } from './components/info-top/info-top.component';
import { RpmGaugeComponent } from './components/rpm-gauge/rpm-gauge.component';
import { SpeedGaugeComponent } from './components/speed-gauge/speed-gauge.component';
import { MphRendererComponent } from './components/speed-gauge/numbers-gauge.component';
import {TimeDisplayComponent } from './components/date-time/date-time.component'
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FuelDisplayComponent } from './components/fuel-gauge/fuel-gauge-perc.component'

const config: SocketIoConfig = ({url: "ws://localhost:8090", options: {transports : ['websocket']}});


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    InfoBottomComponent,
    InfoMapComponent,
    InfoTopComponent,
    RpmGaugeComponent,
    SpeedGaugeComponent,
    MphRendererComponent,
    TimeDisplayComponent,
    FuelDisplayComponent
  ],
  imports: [BrowserModule, SocketIoModule.forRoot(config)],
  bootstrap: [AppComponent]
})
export class AppModule { }
