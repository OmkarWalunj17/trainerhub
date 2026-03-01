import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {}
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm: FormGroup;

  showPassword = false;
  showConfirmPassword = false;

  private strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  constructor(private service: AuthService, private builder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.registerForm = builder.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.(com)$/i)]],

        password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],
        confirmPassword: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],

        mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        userRole: ['', [Validators.required]],
      },
      {
        validators: [this.passwordMatchValidator]
      }
    );
  }

  public get username() { return this.registerForm.controls['username']; }
  public get email() { return this.registerForm.controls['email']; }
  public get password() { return this.registerForm.controls['password']; }
  public get confirmPassword() { return this.registerForm.controls['confirmPassword']; }
  public get mobileNumber() { return this.registerForm.controls['mobileNumber']; }
  public get userRole() { return this.registerForm.controls['userRole']; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.service.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response);
          console.log("Registered successfully");
  
          const emailValue = this.registerForm.get('email')?.value as string;
  
          this.router.navigate(['/verification-sent'], {
            state: { prefillEmail: emailValue }
          });
        },
        error: (err) => {
          console.error(err);
          alert(err?.error || "Registration failed");
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}