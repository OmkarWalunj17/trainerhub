import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-view-requirements',
  imports: [],
  templateUrl: './manager-view-requirements.html',
  styleUrl: './manager-view-requirements.css',
})
export class ManagerViewRequirements {}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Requirement } from 'src/app/models/requirement.model';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-manager-view-requirements',
  templateUrl: './manager-view-requirements.component.html',
  styleUrls: ['./manager-view-requirements.component.css']
})
export class ManagerViewRequirementsComponent implements OnInit {

  requirements: Requirement[] = [];
  filteredRequirements: Requirement[] = [];
  pagedRequirement: Requirement[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;

  statusB: string = '';
  searchI: string = '';

  loading = false;
  managerId!: number;

  showFailureModal: boolean = false;
  failureMessage: string = '';

  showSuccessModal: boolean = false;
  successMessage: string = '';

  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  pendingDeleteId: number | null = null;

  constructor(private service: RequirementService, private router: Router) { }

  ngOnInit(): void {
    this.managerId =  Number(localStorage.getItem('userId'));
    this.loadManagerRequirementsOnce();
  }

  loadManagerRequirementsOnce(): void {
    this.loading = true;


    this.service.getRequirementsByManagerPaged(this.managerId,this.currentPage,this.pageSize,this.searchI,this.statusB)
      .subscribe({
        next: (res) => {
          this.requirements = res.content;
          this.filteredRequirements = [...this.requirements];
          this.currentPage = 1;
          this.updatePagination();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load requirements', err);
          this.failureMessage = err?.error || 'Failed to load requirements.';
          this.showFailureModal = true;
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    const q = (this.searchI || '').toLowerCase().trim();
    const status = (this.statusB || '').trim();

    let list = [...this.requirements];

    if (q) {
      list = list.filter(r => {
        const title = (r.title || '').toLowerCase().trim();
        const dept = (r.department || '').toLowerCase().trim();
        return title.includes(q) || dept.includes(q);
      });
    }

    if (status) {
      list = list.filter(r => (r.status || '') === status);
    }
    this.filteredRequirements = list;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalItems = this.filteredRequirements.length;
    this.totalPages = Math.ceil(this.totalItems/this.pageSize);

    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRequirement = this.filteredRequirements.slice(start, end);
  }

  search(): void {
    this.applyFilters();
  }

  filter(): void {
    this.applyFilters();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  editRequirement(id?: number): void {
    if (!id) return;
    this.router.navigate(['/update-requirement', id]);
  }

  requestDelete(id?: number, title?: string): void {
    if (!id) return;
    this.pendingDeleteId = id;
    this.confirmMessage = `Are you sure you want to delete requirement "${title || 'this record'}"? This action cannot be undone.`;
    this.showConfirmModal = true;
  }

  onConfirmDelete(): void {
    this.showConfirmModal = false;
    const id = this.pendingDeleteId;
    this.pendingDeleteId = null;
    if (!id) return;

    this.service.deleteRequirement(id).subscribe({
      next: () => {
        this.requirements = this.requirements.filter(r => r.requirementId !== id);
        this.applyFilters();
        this.successMessage = 'Requirement deleted successfully.';
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.failureMessage = err.error || 'Failed to delete requirement. Please try again.';
        this.showFailureModal = true;
      }
    });
  }

  onCancelDelete(): void {
    this.showConfirmModal = false;
    this.pendingDeleteId = null;
  }

  onFailureClose() {
    this.showFailureModal = false;
  }

  onSuccessClose() {
    this.showSuccessModal = false;
  }

  viewTrainer(requirementId?: number, trainerId?: number): void {
    if (!requirementId || !trainerId) {
      console.warn('Missing requirementId/trainerId', { requirementId, trainerId });
      return;
    }
    this.router.navigate(['/trainer-details', requirementId, trainerId]);
  }

  isTrainerAssigned(r: Requirement): boolean {
    return r?.trainer?.trainerId != null;
  }
}