import { Component, OnInit } from '@angular/core';
import { CollaborationService } from "../../services/collaboration.service";
import { ActivatedRoute, Params } from '@angular/router';

declare var ace: any;
//the ace is not wroten by typescript, use type any.

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public languages: string[] = ['Java', 'Python'];
  language: string = 'Java';// default language
  editor: any;
  sessionId: string;
  defaultContent = {
    'Java': `public class Example {
                public static void main(String[] args) {
                        // Type your Java code here
                }
             }
        `,
    'Python': `class Solution:
                def example():
                        # write your Python code here`
 };
 //use `` to write multi-line text
  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }
  resetEditor(): void {
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }
  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }
  submit(): void {
    let usercode = this.editor.getValue();
    console.log(usercode);
  }
  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    document.getElementsByTagName('textarea')[0].focus();
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;
    this.editor.on("change", (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if(this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }
}
