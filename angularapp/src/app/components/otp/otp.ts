import { Component } from '@angular/core';

@Component({
  selector: 'app-otp',
  imports: [],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp {}
import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpArray: string[] = ['', '', '', '', '', ''];
  loading = false;

  errorMsg = '';
  infoMsg = '';

  resendDisabled = false;
  countdown = 0;
  private countdownSub?: Subscription;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const challengeId = localStorage.getItem('challengeId');
    if (!challengeId) {
      this.errorMsg = 'Session expired. Please login again.';
      setTimeout(() => this.router.navigate(['/']), 800);
    }
  }

  get otpString(): string {
    return this.otpArray.join('');
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onInput(event: Event, index: number) {
    this.errorMsg = ''; 
    const inputElem = event.target as HTMLInputElement;
    const val = inputElem.value;
    
    if (!/^\d*$/.test(val)) {
      this.otpArray[index] = '';
      inputElem.value = '';
      return;
    }

    if (val && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpArray[index] && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.errorMsg = '';
    
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6); // Extract only up to 6 numbers
    
    for (let i = 0; i < 6; i++) {
      this.otpArray[i] = digits[i] || '';
    }
    
    const focusIndex = digits.length < 6 ? digits.length : 5;
    setTimeout(() => this.otpInputs.toArray()[focusIndex].nativeElement.focus(), 0);
  }

  onVerify(): void {
    const challengeId = localStorage.getItem('challengeId');
    const currentOtp = this.otpString;
  
    if (!challengeId) {
      this.errorMsg = 'Session expired. Please login again.';
      this.router.navigate(['/']);
      return;
    }
  
    if (!currentOtp || currentOtp.length !== 6) {
      this.errorMsg = 'Please enter a 6-digit OTP.';
      return;
    }
  
    this.loading = true;
  
    this.auth.verifyOtp(challengeId, currentOtp).subscribe({
      next: (res) => {
        localStorage.setItem('accesstoken', res.token);
        localStorage.setItem('userId', String(res.userId));
        localStorage.setItem('email', res.email);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userRole', res.userRole);
  
        localStorage.removeItem('challengeId');
  
        this.loading = false;
        this.router.navigate(["/homepage"]).then(() => {
          window.location.reload();
        })
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.status === 401 ? 'Invalid or expired OTP.' : 'Something went wrong.';
      }
    });
  }

  resendOtp(): void {
    const challengeId = localStorage.getItem('challengeId');
    if (!challengeId) {
      this.errorMsg = 'Session expired. Please login again.';
      this.router.navigate(['/']);
      return;
    }

    this.infoMsg = 'If you need a new OTP, please login again.';
    this.startCooldown(30);
  }

  private startCooldown(seconds: number) {
    this.resendDisabled = true;
    this.countdown = seconds;

    this.countdownSub?.unsubscribe();
    this.countdownSub = timer(0, 1000).subscribe((t) => {
      this.countdown = seconds - t;
      if (this.countdown <= 0) {
        this.resendDisabled = false;
        this.countdownSub?.unsubscribe();
      }
    });
  }

  goBackToLogin(): void {
    localStorage.removeItem('challengeId');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }
}