import { Component } from '@angular/core';

@Component({
  selector: 'app-selectedtrainers',
  imports: [],
  templateUrl: './selectedtrainers.html',
  styleUrl: './selectedtrainers.css',
})
export class Selectedtrainers {}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Requirement } from 'src/app/models/requirement.model';
import { RequirementService, PageResponse } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-selected-trainers',
  templateUrl: './selected-trainers.component.html',
  styleUrls: ['./selected-trainers.component.css']
})
export class SelectedTrainersComponent implements OnInit {

  pagedRequirements: Requirement[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;

  searchI = '';
  loading = false;
  managerId!: number;

  constructor(
    private router: Router,
    private requirementService: RequirementService
  ) {}

  ngOnInit(): void {
    this.managerId = Number(localStorage.getItem('userId'));

    if (!this.managerId || isNaN(this.managerId)) {
      console.error('Manager id not found. Please login again.');
      return;
    }
    this.loadSelected();
  }

  loadSelected(): void {
    this.loading = true;

    this.requirementService
      .getSelectedRequirementsPagedByManager(this.managerId, this.currentPage, this.pageSize, this.searchI)
      .subscribe({
        next: (res: PageResponse<Requirement>) => {
          this.pagedRequirements = res.content;
          this.totalPages = res.totalPages;
          this.totalItems = res.totalElements;

          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          if (this.currentPage < 1) this.currentPage = 1;

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading selected trainers', err);
          this.pagedRequirements = [];
          this.totalPages = 1;
          this.totalItems = 0;
          this.loading = false;
        }
      });
  }

  search(): void {
    this.currentPage = 1;
    this.loadSelected();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadSelected();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSelected();
    }
  }

  addFeedback(trainerId?: number): void {
    if (trainerId != null) {
      this.router.navigate(['/manager-post-feedback', trainerId]);
    }
  }
}