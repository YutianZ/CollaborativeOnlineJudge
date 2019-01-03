import { Injectable } from '@angular/core';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  CollaborationSocket: any;
  constructor() { }
  init(): void {
    this.CollaborationSocket = io(window.location.origin, {
      query: 'message=haha'
    });
    this.CollaborationSocket.on("message", (message) => {
      console.log('message received from the server: ' + message);
    })
  }
}
