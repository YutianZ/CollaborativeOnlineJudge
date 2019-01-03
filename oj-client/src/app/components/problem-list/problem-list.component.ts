import { Component, OnInit, OnDestroy } from '@angular/core';
import { Problem } from '../../models/problem.model';
//import { PROBLEMS } from '../../mock-problems';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})

export class ProblemListComponent implements OnInit {
  problems: Problem[];
  subscriptionProblems: Subscription;

  constructor(private dataservice: DataService) { }

  ngOnInit() {
    this.getProblems();
  }
  //unsubscribe when destroy to avoid memory leak
  ngOnDestroy() {
    this.subscriptionProblems.unsubscribe();
  }
  //getProblems return observable need to subscribe it.
  getProblems() {
    this.subscriptionProblems = this.dataservice.getProblems()
    .subscribe(problems => this.problems = problems);
  }
}
