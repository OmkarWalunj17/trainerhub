import { Component } from '@angular/core';

@Component({
  selector: 'app-trainer-details',
  imports: [],
  templateUrl: './trainer-details.html',
  styleUrl: './trainer-details.css',
})
export class TrainerDetails {}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainer } from 'src/app/models/trainer.model';
import { Requirement } from 'src/app/models/requirement.model';
import { TrainerService } from 'src/app/services/trainer.service';
import { RequirementService } from 'src/app/services/requirement.service';
import { PaymentService } from 'src/app/services/payment.service'; // Ensure this is imported
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/app/environments/environment';

declare var window: any;

@Component({
  selector: 'app-trainer-details',
  templateUrl: './trainer-details.component.html',
  styleUrls: ['./trainer-details.component.css']
})
export class TrainerDetailsComponent implements OnInit {

  resumeUrl: SafeResourceUrl | null = null;
  resumeObjectUrl: string | null = null;

  trainerId: number | null = null;
  requirementId: number | null = null;

  trainer?: Trainer;
  requirement?: Requirement;

  showResumeModal = false;

  showConfirmModal = false;
  confirmAction: 'accept' | 'reject' | '' = '';

  isUpdating = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private trainerService: TrainerService, 
    private requirementService: RequirementService, 
    private paymentService: PaymentService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const req = this.route.snapshot.paramMap.get('requirementId');
    const tr = this.route.snapshot.paramMap.get('trainerId');

    this.requirementId = req ? +req : null;
    this.trainerId = tr ? +tr : null;

    this.loadTrainer();
    this.loadRequirement();
  }

  loadTrainer(): void {
    if (!this.trainerId) return;
    this.trainerService.getTrainerById(this.trainerId).subscribe({
      next: (x) => {
        this.trainer = x;
      },
      error: (err) => console.error('Failed to load trainer:', err)
    });
  }

  loadRequirement(): void {
    if (!this.requirementId) return;
    this.requirementService.getRequirementById(this.requirementId).subscribe({
      next: (x) => (this.requirement = x),
      error: (err) => console.error('Failed to load requirement:', err)
    });
  }

   
  async openResume(event?: Event): Promise<void> {
    event?.preventDefault();
    event?.stopPropagation();
 
    const dataUrl = (this.trainer?.resume || '').trim();
    if (!dataUrl.startsWith('data:application/pdf;base64,')) {
      alert('Resume is not a valid PDF data URL.');
      return;
    }
 
    try {
      const base64String = dataUrl.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
 
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const objUrl = URL.createObjectURL(blob);
      window.open(objUrl, '_blank');
 
    } catch (e) {
      console.error('Failed to open resume', e);
      alert('Unable to open resume.');
    }
  }

  closeResume(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.showResumeModal = false;
  }

  showActionButtons(): boolean {
    return (this.requirement?.status || '').toLowerCase() !== 'closed';
  }

  openConfirm(action: 'accept' | 'reject', event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.confirmAction = action;
    this.errorMessage = '';
    this.showConfirmModal = true;
  }

  closeConfirm(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.isUpdating) return;

    this.showConfirmModal = false;
    this.confirmAction = '';
    this.errorMessage = '';
  }

  confirmOk(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.showConfirmModal || !this.confirmAction) return;
    if (!this.requirement) return;

    this.isUpdating = true;
    this.errorMessage = '';

    if (this.confirmAction === 'accept') {
      this.acceptAndPayTrainer();
    } else if (this.confirmAction === 'reject') {
      this.rejectTrainerNow();
    }
  }

  private acceptAndPayTrainer(): void {
    if (!this.requirement || !this.trainerId || !this.requirementId) {
      this.isUpdating = false;
      this.errorMessage = 'Missing requirement or trainer id.';
      return;
    }

    if (typeof window.Razorpay === 'undefined') {
      this.isUpdating = false;
      this.errorMessage = 'Razorpay script is missing! Please add it to index.html.';
      return;
    }

    const amountToPay = this.requirement.budget && this.requirement.budget > 0 
                          ? this.requirement.budget 
                          : 1000;

    this.paymentService.createOrder(this.requirementId, amountToPay).subscribe({
      next: (res: any) => {
        this.openRazorpay(res.orderId, amountToPay);
      },
      error: (err) => {
        console.error('Order creation failed:', err);
        this.isUpdating = false;
        this.errorMessage = 'Failed to initiate payment. Check backend logs.';
      }
    });
  }

  private openRazorpay(orderId: string, amount: number): void {
    const options = {
      key: environment.razorpayKey, // Your Razorpay Key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Trainer Hub',
      description: 'Trainer Assignment Fee',
      order_id: orderId,
      handler: (response: any) => {
        this.verifyPayment(response);
      },
      prefill: {
        name: 'Manager',
        email: 'manager@example.com',
        contact: '9999999999'
      },
      theme: { color: '#84cc16' },
      modal: {
        ondismiss: () => {
          this.isUpdating = false;
          this.errorMessage = 'Payment was cancelled by the user.';
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        this.isUpdating = false;
        this.errorMessage = 'Payment Failed: ' + response.error.description;
      });
      rzp.open();
    } catch (e) {
      this.isUpdating = false;
      this.errorMessage = 'Error opening Razorpay checkout window.';
      console.error(e);
    }
  }

  private verifyPayment(paymentResponse: any): void {
    this.paymentService.verifyPayment(paymentResponse).subscribe({
      next: (verifyRes) => {
        this.assignTrainerFinal();
      },
      error: (err) => {
        console.error('Verification failed', err);
        this.isUpdating = false;
        this.errorMessage = 'Payment verification failed.';
      }
    });
  }

  private assignTrainerFinal(): void {
    const updated: Requirement = {
      ...this.requirement,
      trainer: {
        ...(this.requirement?.trainer ?? {}),
        trainerId: this.trainerId
      },
      status: 'Closed'
    };

    this.requirementService.updateRequirement(this.requirementId!, updated).subscribe({
      next: () => {
        this.isUpdating = false;
        this.showConfirmModal = false;
        this.confirmAction = '';
        alert('Payment successful! Trainer Assigned.');
        this.router.navigate(['/selected-trainers']);
      },
      error: (err) => {
        console.error(err);
        this.isUpdating = false;
        this.errorMessage = 'Payment succeeded, but failed to assign trainer in DB. Contact support.';
      }
    });
  }

  private rejectTrainerNow(): void {
    if (!this.showConfirmModal || this.confirmAction !== 'reject') {
      this.isUpdating = false;
      return;
    }

    if (!this.requirement || !this.requirementId) {
      this.isUpdating = false;
      this.errorMessage = 'Missing requirement id.';
      return;
    }

    const updated: Requirement = {
      requirementId: this.requirement?.requirementId,
      title: this.requirement?.title,
      description: this.requirement?.description,
      department: this.requirement?.department,
      postedDate: this.requirement?.postedDate,
      status: 'Open',
      duration: this.requirement?.duration,
      location: this.requirement?.location,
      skillLevel: this.requirement?.skillLevel,
      priority: this.requirement?.priority,
      mode: this.requirement?.mode,
      budget: this.requirement?.budget,
      trainer: null
    };

    this.requirementService.updateRequirement(this.requirementId, updated).subscribe({
      next: () => {
        this.isUpdating = false;
        this.showConfirmModal = false;
        this.confirmAction = '';
        alert('Trainer Rejected');
        this.router.navigate(['/view-requirements']);
      },
      error: (err) => {
        console.error(err);
        this.isUpdating = false;
        this.errorMessage = 'Failed to reject trainer. Please try again.';
      }
    });
  }
}