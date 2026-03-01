import { Component } from '@angular/core';

@Component({
  selector: 'app-coordinatorviewfeedback',
  imports: [],
  templateUrl: './coordinatorviewfeedback.html',
  styleUrl: './coordinatorviewfeedback.css',
})
export class Coordinatorviewfeedback {}
import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { Trainer } from 'src/app/models/trainer.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-coordinatorviewfeedback',
  templateUrl: './coordinatorviewfeedback.component.html',
  styleUrls: ['./coordinatorviewfeedback.component.css']
})
export class CoordinatorviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];

  pagedFeedback : Feedback[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  categories: string[] = [];
  category = '';

  user: User | null = null;
  trainer: Trainer | null = null;

  loadingFeedbacks = false;
  loadingUser = false;
  loadingTrainer = false;

  constructor(private fservice: FeedbackService,private auth: AuthService,private tservice: TrainerService) {}

  ngOnInit(): void {
    this.getFeedbacks();
  }

  getFeedbacks(): void {
    this.loadingFeedbacks = true;

    this.fservice.getFeedbacks().subscribe({
      next: (fbs) => {
        this.feedbacks = fbs;
        this.filteredFeedbacks = [...this.feedbacks];

        this.categories = Array.from(new Set(this.feedbacks.map(f => f.category).filter(Boolean)));
        
        this.currentPage = 1;
        this.updatedPagination();
        this.loadingFeedbacks = false;
      },
      error: (err) => {
        console.error('Failed to load feedbacks:', err);
        this.loadingFeedbacks = false;
        this.feedbacks = [];
        this.filteredFeedbacks = [];
        this.categories = [];
      }
    });
  }

  filterByCategory(category: string): void {
    this.category = category;
  
    if (!category) {
      this.filteredFeedbacks = [...this.feedbacks];
    } else {
      const q = category.toLowerCase();
      this.filteredFeedbacks = this.feedbacks.filter(f =>(f.category ?? '').toLowerCase() === q);
    }
  
    this.currentPage = 1;       
    this.updatedPagination();  
  }

  showUserProfile(userId?: number): void {
    const id =userId;
    if (id == null || Number.isNaN(id)) {
      console.warn('User ID is missing for this feedback row.');
      this.user = null;
      return;
    }
    this.loadingUser = true;
    this.user = null;

    this.auth.getUserById(id).subscribe({
      next: (u) => {
        this.user = u;
        this.loadingUser = false;
      },
      error: (err) => {
        console.error('Failed to load user details:', err);
        this.loadingUser = false;
      }
    });
    this.updatedPagination();
  }

  clearUser(): void {
    this.user = null;
  }

  showTrainer(trainerId?: number): void {
    const id = trainerId ;

    if (id == null || Number.isNaN(id)) {
      console.warn('Trainer ID is missing for this feedback row.');
      this.trainer = null;
      return;
    }

    this.loadingTrainer = true;
    this.trainer = null;

    this.tservice.getTrainerById(id).subscribe({
      next: (t) => {
        this.trainer = t;
        this.loadingTrainer = false;
      },
      error: (err) => {
        console.error('Failed to load trainer details:', err);
        this.loadingTrainer = false;
      }
    });
  }

  updatedPagination(){
    const totalItems = this.filteredFeedbacks.length;
    this.totalPages = Math.ceil(totalItems/this.pageSize) || 1;

    if(this.currentPage>this.totalPages)  this.currentPage = this.pageSize;
    if(this.currentPage < 1)  this.currentPage = 1;

    const start = (this.currentPage-1)*this.pageSize;
    const end = start + this.pageSize;

    this.pagedFeedback = this.filteredFeedbacks.slice(start,end);

  }

  nextPage() :void{
    if(this.currentPage<this.totalPages){
      this.currentPage++;
      this.updatedPagination();
    }
  }

  prevPage():void{
    if(this.currentPage>1){
      this.currentPage--;
      this.updatedPagination();
    }
  }

  clearTrainer(): void {
    this.trainer = null;
  }

  trackById(index: number, item: Feedback) {
    return (item as any).feedbackId ?? index;
  }
}