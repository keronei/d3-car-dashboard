import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {
    this.socket.on('connect_error', (error: any) => {
        console.error("Connection: "+ error)
    })

    this.socket.on('disconnect', (reason: any) => {
console.warn('Disconnected: '+ reason)
    })

    this.socket.on('connect', (origin: any) => {
        console.log('Connected to '+origin)
        this.socket.emit('message', 'start')
    })

    this.socket.on('message', (data: any) => {
        console.log('data:'+ data)
    })
   }

  // Method to subscribe to gpio-data
  getGpioData(): Observable<any> {
    return this.socket.fromEvent('ecuData')
  }

  // You can add more methods to subscribe to other events
  // getAnotherEvent(): Observable<any> {
  //   return this.socket.fromEvent('another-event');
  // }
}
