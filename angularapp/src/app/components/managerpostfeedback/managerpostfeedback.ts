import { Component } from '@angular/core';

@Component({
  selector: 'app-managerpostfeedback',
  imports: [],
  templateUrl: './managerpostfeedback.html',
  styleUrl: './managerpostfeedback.css',
})
export class Managerpostfeedback {}
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Feedback } from "src/app/models/feedback.model";
import { FeedbackService } from "src/app/services/feedback.service";

@Component({
  selector: 'app-managerpostfeedback',
  templateUrl: './managerpostfeedback.component.html',
  styleUrls: ['./managerpostfeedback.component.css']
})
export class ManagerpostfeedbackComponent implements OnInit {

  trainerId: number = 0;
  userId: number = 0;

  feedbackText: string = '';
  category: string = '';

  categories: string[] = ['Good', 'Average', 'Bad'];

  constructor(private route: ActivatedRoute, private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = Number(localStorage.getItem('userId'));
  }

  submitFeedback(): void {
    const payload: Feedback = {
      user: { userId: this.userId },
      trainer: { trainerId: this.trainerId },
      category: this.category,
      feedbackText: this.feedbackText,
      date: new Date(),
    };

    console.log(payload);
    this.feedbackService.sendFeedback(payload).subscribe({
      next: () => {
        console.log('Successfully Added!');
        this.feedbackText = '';
        this.category = '';
        this.router.navigate(['/manager-view-feedbacks']);
      },
    });
  }
}