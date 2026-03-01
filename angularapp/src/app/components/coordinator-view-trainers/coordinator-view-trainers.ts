import { Component } from '@angular/core';

@Component({
  selector: 'app-coordinator-view-trainers',
  imports: [],
  templateUrl: './coordinator-view-trainers.html',
  styleUrl: './coordinator-view-trainers.css',
})
export class CoordinatorViewTrainers {}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trainer } from 'src/app/models/trainer.model';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-coordinator-view-trainers',
  templateUrl: './coordinator-view-trainers.component.html',
  styleUrls: ['./coordinator-view-trainers.component.css']
})
export class CoordinatorViewTrainersComponent implements OnInit {

  trainers: Trainer[] = [];
  filteredTrainers: Trainer[] = [];

  searchText: string = "";
  searchStatusText: string = "";

  selectedTrainer: Trainer | undefined;

  showFailureModal: boolean = false;
  failureMessage: string = '';

  showSuccessModal: boolean = false;
  successMessage: string = '';

  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  pendingDeleteTrainer: Trainer | null = null;

  pagedTrainer: Trainer[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  loadingTrainers = false;

  isOpeningResume = false;

  constructor(private service: TrainerService, private router: Router) { }

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers() {
    this.loadingTrainers = true;

    this.service.getAllTrainers().subscribe({
      next: (response) => {
        this.trainers = response;
        this.filteredTrainers = [...this.trainers];
        this.currentPage = 1;
        this.updatedPagination();
        this.loadingTrainers = false;
      },
      error: (err) => {
        console.error('Failed to load trainers:', err);
        this.failureMessage = 'Failed to load trainers. Please refresh the page.';
        this.showFailureModal = true;
        this.loadingTrainers = false;
      }
    });
  }

  requestDelete(trainer: Trainer) {
    this.pendingDeleteTrainer = trainer;
    this.confirmMessage = `Are you sure you want to delete trainer "${trainer.name}"? This action cannot be undone.`;
    this.showConfirmModal = true;
  }

  onConfirmDelete() {
    this.showConfirmModal = false;

    const trainer = this.pendingDeleteTrainer;
    this.pendingDeleteTrainer = null;

    if (!trainer?.trainerId) return;

    this.loadingTrainers = true;

    this.service.deleteTrainer(trainer.trainerId).subscribe({
      next: () => {
        this.successMessage = `Trainer "${trainer.name}" deleted successfully.`;
        this.showSuccessModal = true;
        this.loadTrainers(); 
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.failureMessage = err.error || 'Failed to delete trainer. Please try again.';
        this.showFailureModal = true;
        this.loadingTrainers = false;
      }
    });
  }

  onCancelDelete() {
    this.showConfirmModal = false;
    this.pendingDeleteTrainer = null;
  }

  updateTrainer(trainer: Trainer) {
    this.router.navigate(['/add-trainer/' + trainer.trainerId]);
  }

  searchTrainers() {
    const q = (this.searchText || '').toLowerCase().trim();

    if (!q) {
      this.filteredTrainers = [...this.trainers];
    } else {
      this.filteredTrainers = this.trainers.filter((trainer) => {
        const name = (trainer.name || '').toLowerCase().trim();
        const expertise = (trainer.expertise || '').toLowerCase().trim();
        return name.includes(q) || expertise.includes(q);
      });
    }

    this.currentPage = 1;
    this.updatedPagination();
  }

  searchByStatus() {
    const status = (this.searchStatusText || '').trim();

    if (!status) {
      this.filteredTrainers = [...this.trainers];
    } else {
      this.filteredTrainers = this.trainers.filter((trainer) =>(trainer.status || '') === status);
    }

    this.currentPage = 1;
    this.updatedPagination();
  }

  async viewResume(trainer: Trainer) {
    const dataUrl = (trainer.resume || '').trim();

    if (!dataUrl.startsWith('data:application/pdf;base64,')) {
      this.failureMessage = 'This trainer does not have a valid PDF resume attached.';
      this.showFailureModal = true;
      return;
    }

    try {
      this.isOpeningResume = true;
      const blob = await fetch(dataUrl).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank', 'noopener,noreferrer');

      if (!win || win.closed || typeof win.closed === 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      console.error(e);
      this.failureMessage = 'Unable to open resume. Please try again.';
      this.showFailureModal = true;
    } finally {
      this.isOpeningResume = false;
    }
  }

  toggleStatus(trainer: Trainer) {
    if (!trainer.trainerId) return;

    const previousStatus = trainer.status;
    trainer.status = trainer.status === 'Active' ? 'Inactive' : 'Active';

    this.service.updateTrainer(trainer.trainerId, trainer).subscribe({
      next: () => {
        this.loadTrainers();
      },
      error: (err) => {
        console.error('Status update failed:', err);
        trainer.status = previousStatus;
        this.failureMessage = err.error || 'Could not update trainer status. Please try again.';
        this.showFailureModal = true;
      }
    });
  }

  onFailureClose() {
    this.showFailureModal = false;
  }

  onSuccessClose() {
    this.showSuccessModal = false;
  }

  updatedPagination() {
    const totalItem = this.filteredTrainers.length;
    this.totalPages = Math.ceil(totalItem / this.pageSize);

    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedTrainer = this.filteredTrainers.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatedPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatedPagination();
    }
  }
}