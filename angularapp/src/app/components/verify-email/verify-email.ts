import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  status: 'loading' | 'success' | 'error' | 'missing' = 'loading';
  message = '';
  countdown = 3;

  private countdownTimer?: ReturnType<typeof setInterval>;
  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');

      this.clearTimers();

      if (!token) {
        this.status = 'missing';
        this.message = 'Missing token in verification link.';
        return;
      }

      this.status = 'loading';
      this.message = 'Verifying your email…';

      this.http.get(
        `${environment.backendUrl}/api/verify-email`,
        { params: { token }, responseType: 'text' }
      ).subscribe({
        next: (res) => {
          this.status = 'success';
          this.message = res || 'Email verified successfully.';
          this.startRedirectCountdown(3);
        },
        error: (err) => {
          this.status = 'error';

          const serverMsg =
            typeof err?.error === 'string'
              ? err.error
              : err?.error?.message;

          this.message = serverMsg || 'Verification link is invalid or expired.';
        }
      });
    });
  }

  private startRedirectCountdown(seconds: number) {
    this.clearTimers();
    this.countdown = seconds;

    this.countdownTimer = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        this.clearTimers();
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }

  goToLoginNow() {
    this.clearTimers();
    this.router.navigateByUrl('/login');
  }

  private clearTimers() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.routeSub?.unsubscribe();
  }
}