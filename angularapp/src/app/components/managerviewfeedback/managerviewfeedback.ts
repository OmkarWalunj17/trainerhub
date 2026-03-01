import { Component } from '@angular/core';

@Component({
  selector: 'app-managerviewfeedback',
  imports: [],
  templateUrl: './managerviewfeedback.html',
  styleUrl: './managerviewfeedback.css',
})
export class Managerviewfeedback {}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { Trainer } from 'src/app/models/trainer.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-managerviewfeedback',
  templateUrl: './managerviewfeedback.component.html',
  styleUrls: ['./managerviewfeedback.component.css']
})
export class ManagerviewfeedbackComponent implements OnInit {

  pagedFeedback: Feedback[] = [];

  trainer: Trainer | null = null;
  confirmDeleteId: number | null = null;
  selectedFeedback: Feedback | null = null;

  currentPage = 1;  
  pageSize = 1;
  totalPages = 1;
  totalItems = 0;  

  loading = false;

  constructor(private service: FeedbackService,private tservice: TrainerService,private router: Router,private ar: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadFeedbacksPaged();
  }

  loadFeedbacksPaged(): void {
    this.loading = true;
    const userId = Number(localStorage.getItem('userId'));
    this.service.getAllFeedbacksByUserIdPaged(userId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.pagedFeedback = res.content;
        this.totalPages = res.totalPages;
        this.totalItems = res.totalElements;

        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        if (this.currentPage < 1) this.currentPage = 1;

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load feedbacks:', err);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFeedbacksPaged();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFeedbacksPaged();
    }
  }

  showTrainer(trainerId?: number): void {
    if (trainerId == null || Number.isNaN(trainerId)) {
      console.warn('Trainer ID is missing for this feedback row.');
      this.trainer = null;
      return;
    }

    this.tservice.getTrainerById(trainerId).subscribe({
      next: (x) => (this.trainer = x),
      error: (err) => console.error('Failed to load trainer details:', err),
    });
  }

  askDelete(feedbackId: number | undefined): void {
    if (!feedbackId) return;
    this.confirmDeleteId = feedbackId;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(): void {
    if (this.confirmDeleteId == null) return;
    const id = this.confirmDeleteId;

    this.trainer = null;

    this.service.deleteFeedback(id).subscribe({
      next: () => {
        console.log('Successfully deleted feedback:', id);
        this.confirmDeleteId = null;
        this.loadFeedbacksPaged();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.confirmDeleteId = null;
      }
    });
  }

  clearTrainer(): void {
    this.trainer = null;
  }

  viewFeedback(f: Feedback): void {
    this.selectedFeedback = f;
  }

  closeFeedback(): void {
    this.selectedFeedback = null;
  }

  trackById(index: number, item: Feedback): number | string {
    return item.feedbackId ?? index;
  }
}
