import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;
  
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private service:AuthService, private builder:FormBuilder, private router: Router){
    this.loginForm = builder.group({
      email: ['', [Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.(com)$/i)]],   
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]]
      //min 8 characters,lowercase,uppercase,number, special character from @$!%*?&
  })

  }
  ngOnInit(): void {  
  //Read navigation state
  const emailFromState = history.state?.prefillEmail;
  //Patch only if it is a string
  if (typeof emailFromState === 'string' && emailFromState.trim().length > 0) {
    this.loginForm.patchValue({ email: emailFromState });
    //clear state so it doesn't stick on back navigation
    history.replaceState({}, document.title);
  }
  }

  public get email(){
    return this.loginForm.controls.email;
  }

  public get password(){
    return this.loginForm.controls.password;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
  
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
  
    this.service.login(email, password).subscribe({
      next: (res: any) => {
        if (res?.status === 'EmailNotVerified') {
          alert('Please verify your email first. Check your inbox.');
        }
  
        if (res?.status === '2FARequired') {
          localStorage.setItem('challengeId', res.challengeId);
          this.router.navigate(['/verify-otp'], { state: { prefillEmail: email } });
          return;
        }
        alert('Unexpected response. Please try again.');
      },
      error: (err) => {
        console.error(err);
        alert('Invalid email/password');
      }
    });
  }
  
}
