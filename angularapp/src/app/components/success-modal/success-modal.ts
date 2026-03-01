import { Component } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  imports: [],
  templateUrl: './success-modal.html',
  styleUrl: './success-modal.css',
})
export class SuccessModal {}
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Trainer saved successfully!';
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}