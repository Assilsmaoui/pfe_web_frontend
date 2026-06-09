import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WsUserStatusService {

  private socket!: WebSocket;

 connect(userId: string, callback: (data: any) => void) {

  this.socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}`);

  this.socket.onopen = () => {
    console.log('WebSocket connected');
  };

  this.socket.onmessage = (event) => {
    console.log("WS MESSAGE:", event.data);

    const data = JSON.parse(event.data);
    callback(data);
  };

  this.socket.onclose = () => {
    console.log('WebSocket closed');
  };
}

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}