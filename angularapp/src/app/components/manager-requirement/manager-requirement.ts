import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-requirement',
  imports: [],
  templateUrl: './manager-requirement.html',
  styleUrl: './manager-requirement.css',
})
export class ManagerRequirement {}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Requirement } from 'src/app/models/requirement.model';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-manager-requirement',
  templateUrl: './manager-requirement.component.html',
  styleUrls: ['./manager-requirement.component.css']
})
export class ManagerRequirementComponent implements OnInit {

  requirementForm!: FormGroup;
  requirement!: Requirement;

  id: number | null = null;

  isLoading: boolean = false;

  showFailureModal: boolean = false;
  showSuccessModal: boolean = false;
  failureMessage: string = '';
  successMessage: string = '';

  requirements: Requirement[] = [];

  constructor(private service: RequirementService,private fb: FormBuilder,private ar: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {

    this.loadRequirements();
    this.requirementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      department: ['', Validators.required],
      duration: ['', Validators.required],
      mode: ['', Validators.required],
      location: ['', Validators.required],
      skillLevel: ['', Validators.required],
      budget: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['Open']
    });

    const idParam = this.ar.snapshot.paramMap.get('id');
    this.id = Number(idParam);

    if (this.id) {
      this.service.getRequirementById(this.id).subscribe({
        next: (d) => {
          this.requirement = d;
          this.requirementForm.patchValue(this.requirement);
        },
        error: (err) => {
          console.error(err);
          this.failureMessage = err?.error || 'Failed to load requirement.';
          this.showFailureModal = true;
        }
      });
    }
  }

  saveRequirement(): void {
    if (!this.requirementForm.valid) return;

    this.isLoading = true;

    const managerId = Number(localStorage.getItem('userId')); 

    if (!managerId) {
      this.isLoading = false;
      this.failureMessage = 'Manager id not found. Please login again.';
      this.showFailureModal = true;
      return;
    }

    const payload: Requirement = {
      ...this.requirementForm.value,
      manager: { userId: managerId } 
    };

    if (!this.id) {
      this.service.addRequirement(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Requirement added successfully!';
          this.showSuccessModal = true;
          this.loadRequirements();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.failureMessage = err?.error || 'Failed to add requirement. Please try again.';
          this.showFailureModal = true;
        }
      });

    } else {
      const updatedRequirement: Requirement = {
        ...payload,
        requirementId: this.requirement.requirementId,
        postedDate: this.requirement.postedDate,
        status: this.requirement.status,     
        trainer: this.requirement.trainer     
      };

      this.service.updateRequirement(this.id, updatedRequirement).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Requirement updated successfully!';
          this.showSuccessModal = true;
          this.loadRequirements();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.failureMessage = err?.error || 'Failed to update requirement. Please try again.';
          this.showFailureModal = true;
        }
      });
    }
  }

  onFailureClose() {
    this.showFailureModal = false;
  }

  onSuccessClose() {
    this.showSuccessModal = false;
    this.router.navigate(['/view-requirements']);
  }

  loadRequirements() {
    this.service.getAllRequirements().subscribe({
      next: (x) => this.requirements = x ?? [],
      error: (err) => console.error(err)
    });
  }

  public get title() { return this.requirementForm.controls.title; }
  public get description() { return this.requirementForm.controls.description; }
  public get department() { return this.requirementForm.controls.department; }
  public get duration() { return this.requirementForm.controls.duration; }
  public get mode() { return this.requirementForm.controls.mode; }
  public get location() { return this.requirementForm.controls.location; }
  public get skillLevel() { return this.requirementForm.controls.skillLevel; }
  public get budget() { return this.requirementForm.controls.budget; }
  public get priority() { return this.requirementForm.controls.priority; }
}