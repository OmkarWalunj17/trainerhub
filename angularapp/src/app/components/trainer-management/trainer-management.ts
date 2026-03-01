import { Component } from '@angular/core';

@Component({
  selector: 'app-trainer-management',
  imports: [],
  templateUrl: './trainer-management.html',
  styleUrl: './trainer-management.css',
})
export class TrainerManagement {}
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainer } from 'src/app/models/trainer.model';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-trainer-management',
  templateUrl: './trainer-management.component.html',
  styleUrls: ['./trainer-management.component.css']
})
export class TrainerManagementComponent implements OnInit {

  @ViewChild('resumeInput') resumeInput!: ElementRef<HTMLInputElement>;

  addTrainerForm: FormGroup;
  updateId: number = 0;
  updateTrainer: Trainer = {} as Trainer;

  isLoading: boolean = false;
  showSuccessModal: boolean = false;
  showFailureModal: boolean = false;
  successMessage: string = '';
  failureMessage: string = '';

  base64: string | null = null;
  selectedFile: File | null = null;
  duplicateEmailMsg: any;
expectedSalary: any;

  constructor(
    private trainerService: TrainerService,
    private builder: FormBuilder,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
    this.addTrainerForm = this.builder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.(com)$/i)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      expertise: ['', Validators.required],
      experience: ['', Validators.required],
      certification: ['', Validators.required],
      resume: [''],
      joiningDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.updateId = Number(this.aRoute.snapshot.params['id']) || 0;

    if (this.updateId > 0) {
      this.trainerService.getTrainerById(this.updateId).subscribe({
        next: (response) => {
          this.updateTrainer = response;
          this.addTrainerForm.patchValue(this.updateTrainer);
          this.base64 = null;
          if (this.resumeInput?.nativeElement) {
            this.resumeInput.nativeElement.value = '';
          }
        },
        error: (err) => console.error('Error fetching trainer:', err)
      });
    }
  }

  onFileSelect(evt: Event) {
    const target = evt.target as HTMLInputElement;
    const f = target.files?.[0] as File;
    this.selectedFile = f || null;

    if (!f) { this.base64 = null; return; }

    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      this.selectedFile = null;
      this.base64 = null;
      if (this.resumeInput?.nativeElement) this.resumeInput.nativeElement.value = '';
      this.failureMessage = 'Only PNG, JPEG or PDF files are allowed.';
      this.showFailureModal = true;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.base64 = reader.result as string;
      this.addTrainerForm.patchValue({ resume: this.base64 });
    };
    reader.readAsDataURL(f);
  }

  public get name() { return this.addTrainerForm.get('name')!; }
  public get email() { return this.addTrainerForm.get('email')!; }
  public get phone() { return this.addTrainerForm.get('phone')!; }
  public get expertise() { return this.addTrainerForm.get('expertise')!; }
  public get experience() { return this.addTrainerForm.get('experience')!; }
  public get certification() { return this.addTrainerForm.get('certification')!; }
  public get resume() { return this.addTrainerForm.get('resume')!; }
  public get joiningDate() { return this.addTrainerForm.get('joiningDate')!; }

  onSuccessClose() {
    this.showSuccessModal = false;
    this.router.navigate(['/view-trainers']);
  }

  onFailureClose() {
    this.showFailureModal = false;
  }

  addTrainer() {
    if (this.addTrainerForm.invalid) {
      this.addTrainerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.updateId > 0) {
      const updatedTrainer: Trainer = this.addTrainerForm.value;
      updatedTrainer.status = this.updateTrainer.status;
      this.trainerService.updateTrainer(this.updateId, updatedTrainer).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Trainer updated successfully!';
          this.showSuccessModal = true;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);

          if (err.status === 409) {
            this.duplicateEmailMsg = err.error || 'Trainer with this email already exists.';
            this.email!.setErrors({ duplicate: true });
            this.failureMessage = this.duplicateEmailMsg;
            this.showFailureModal = true;
            return;
          }

          this.failureMessage = err.error || 'Failed to update trainer. Please try again.';
          this.showFailureModal = true;
        }
      });
    } else {
      const trainer: Trainer = this.addTrainerForm.value;
      trainer.status = 'Active';
      this.trainerService.addTrainer(trainer).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Trainer added successfully!';
          this.showSuccessModal = true;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);

          if (err.status === 409) {
            this.duplicateEmailMsg = err.error || 'Trainer with this email already exists.';
            this.email!.setErrors({ duplicate: true });
            this.failureMessage = this.duplicateEmailMsg;
            this.showFailureModal = true;
            return;
          }

          this.failureMessage = err.error || 'Failed to add trainer. Please try again.';
          this.showFailureModal = true;
        }
      });
    }
  }
}