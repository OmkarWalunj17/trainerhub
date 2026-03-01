import { Component } from '@angular/core';

@Component({
  selector: 'app-coordinator-view-requirements',
  imports: [],
  templateUrl: './coordinator-view-requirements.html',
  styleUrl: './coordinator-view-requirements.css',
})
export class CoordinatorViewRequirements {}
import { Component, OnInit } from '@angular/core';
import { Requirement } from 'src/app/models/requirement.model';
import { Trainer } from 'src/app/models/trainer.model';
import { RequirementService } from 'src/app/services/requirement.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { SettingsService } from 'src/app/services/settings.service'; // ✅ INJECTED
 
@Component({
  selector: 'app-coordinator-view-requirements',
  templateUrl: './coordinator-view-requirements.component.html',
  styleUrls: ['./coordinator-view-requirements.component.css']
})
export class CoordinatorViewRequirementsComponent implements OnInit {
 
  requirement: Requirement[] = [];
  filteredRequirement: Requirement[] = [];
  pagedRequirement: Requirement[] = [];
 
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
 
  trainer: Trainer[] = [];
  filteredTrainer: Trainer[] = [];
 
  searchI: string = '';
  searchT: string = '';
 
  showAssignModal: boolean = false;
  selectedRequirement: Requirement | null = null;
 
  loadingTrainer = false;
  loadingRequirements = false;
  isAutoAssignEnabled: boolean = false;
 
  constructor(
    private service: RequirementService,
    private services: TrainerService,
    private settingsService: SettingsService
  ) { }
 
  ngOnInit(): void {
    this.loadManagerViewRequirements();
 
    this.settingsService.getAutoAssignStatus().subscribe({
      next: (status) => this.isAutoAssignEnabled = status
    });
  }
 
  toggleAutoAssign(): void {
    this.settingsService.toggleAutoAssign(this.isAutoAssignEnabled).subscribe({
      next: (res) => {
        console.log('Auto Assign is now: ' + (res ? 'ON' : 'OFF'));
      },
      error: (err) => {
        alert('Failed to update Auto-Assign settings.');
        this.isAutoAssignEnabled = !this.isAutoAssignEnabled; // revert on fail
      }
    });
  }
 
  loadManagerViewRequirements(): void {
    this.loadingRequirements = true;
 
    this.service.getAllRequirements().subscribe({
      next: (x) => {
        this.requirement = x;
        this.filteredRequirement = [...this.requirement];
 
        this.currentPage = 1;
        this.updatePagination();
        this.loadingRequirements = false;
      },
      error: (err) => {
        console.error('Failed to load requirements', err);
        this.loadingRequirements = false;
      }
    });
  }
 
  search(): void {
    const q = (this.searchI || '').toLowerCase().trim();
 
    if (!q) {
      this.filteredRequirement = [...this.requirement];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }
 
    this.filteredRequirement = this.requirement.filter((x) =>(x.title || '').toLowerCase().trim().includes(q) ||(x.department || '').toLowerCase().trim().includes(q));
    this.currentPage = 1;
    this.updatePagination();
  }
 
  updatePagination(): void {
    const totalItems = this.filteredRequirement.length;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
 
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;
 
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
 
    this.pagedRequirement = this.filteredRequirement.slice(start, end);
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
 
  openAssignTrainerModal(req: Requirement): void {
    this.selectedRequirement = req;
    this.showAssignModal = true;
    this.searchT = '';
    this.loadTrainers();
  }
 
  closeModal(): void {
    this.showAssignModal = false;
    this.selectedRequirement = null;
 
    this.trainer = [];
    this.filteredTrainer = [];
    this.searchT = '';
    this.loadingTrainer = false;
  }
 
  loadTrainers(): void {
    this.loadingTrainer = true;
 
    this.services.getAllTrainers().subscribe({
      next: (t) => {
        const all = t;
        this.trainer = all.filter(x => (x.status || '').toLowerCase() === 'active');
        this.filteredTrainer = [...this.trainer];
        this.loadingTrainer = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingTrainer = false;
        this.trainer = [];
        this.filteredTrainer = [];
      }
    });
  }
 
  searchTrainer(): void {
    const q = (this.searchT || '').toLowerCase().trim();
 
    if (!q) {
      this.filteredTrainer = [...this.trainer];
      return;
    }
    this.filteredTrainer = this.trainer.filter((x) =>(x.name || '').toLowerCase().includes(q) ||(x.expertise || '').toLowerCase().includes(q));
  }
 
  assignTrainerToRequirement(t: Trainer): void {
    if (!this.selectedRequirement?.requirementId) return;
 
    const reqId = this.selectedRequirement.requirementId;
    const payload: Requirement = {
      ...this.selectedRequirement,
      trainer: {
        ...this.selectedRequirement.trainer,
        trainerId: t.trainerId
      },
      status: 'Open'
    };
 
    this.service.assignTrainer(reqId, payload).subscribe({
      next: () => {
        this.loadManagerViewRequirements();
        this.closeModal();
        alert('Trainer assigned successfully. Waiting for manager approval.');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to assign trainer.');
      }
    });
  }
 
  isTrainerAssigned(r: Requirement): boolean {
    return r.trainer?.trainerId != null;
  }
}