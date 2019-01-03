import { Injectable } from '@angular/core';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  CollaborationSocket: any;
  constructor() { }
  init(editor: any, sessionId: string): void {
    this.CollaborationSocket = io(window.location.origin, {
      query: 'sessionId=' + sessionId
    });
    this.CollaborationSocket.on("change", (delta: string) => {
      console.log('collaboration: editor changes ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    })
  }
  change(delta: string): void {
    this.CollaborationSocket.emit("change", delta);
  }
}
