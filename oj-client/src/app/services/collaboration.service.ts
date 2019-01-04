import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from "rxjs";

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket: any;

  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }
  constructor() { }
  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {
      query: 'sessionId=' + sessionId
    });
    this.collaborationSocket.on("change", (delta: string) => {
      console.log('collaboration: editor changes ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    })
  }
  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
  }
}
