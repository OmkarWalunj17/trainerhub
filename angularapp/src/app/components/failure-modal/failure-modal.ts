import { Component } from '@angular/core';

@Component({
  selector: 'app-failure-modal',
  imports: [],
  templateUrl: './failure-modal.html',
  styleUrl: './failure-modal.css',
})
export class FailureModal {}
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-failure-modal',
  templateUrl: './failure-modal.component.html',
  styleUrls: ['./failure-modal.component.css']
})
export class FailureModalComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Something went wrong. Please try again.';
  @Input() buttonText: string = 'Try Again';
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}