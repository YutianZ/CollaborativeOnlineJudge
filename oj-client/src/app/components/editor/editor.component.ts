import { Component, OnInit } from '@angular/core';
import { CollaborationService } from "../../services/collaboration.service";
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
  constructor(private collaboration: CollaborationService) { }

  ngOnInit() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    this.collaboration.init();
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
}
