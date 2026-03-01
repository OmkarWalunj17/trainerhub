import { Component } from '@angular/core';

@Component({
  selector: 'app-verification-sent',
  imports: [],
  templateUrl: './verification-sent.html',
  styleUrl: './verification-sent.css',
})
export class VerificationSent {}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification-sent',
  templateUrl: './verification-sent.component.html',
  styleUrls: ['./verification-sent.component.css']
})
export class VerificationSentComponent implements OnInit {
  email = '';

  ngOnInit(): void {
    const emailFromState = history.state?.prefillEmail;
    if (typeof emailFromState === 'string') {
      this.email = emailFromState;
      history.replaceState({}, document.title);
    }
  }
}