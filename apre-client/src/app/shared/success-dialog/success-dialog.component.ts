/**
 * Author: David Clemens
 * Date: 2025-01-28
 * File: success-dialog.component.ts
 * Description: Success dialog component
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="success-dialog">
      <h1 class="success-dialog__title">{{ header }}</h1>
      <p class="success-dialog__message">{{ message }}</p>
      <div class="success-dialog__actions">
        <button class="button button--primary" (click)="confirm(true)">Ok</button>
        <!-- <button class="button button--secondary" (click)="confirm(false)">No</button> -->
      </div>
    </div>
  `,
  styles: `
  .success-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      border-radius: 8px;
    }
    .success-dialog__title {
      margin: 0;
      font-size: 1.5em;
    }
    .success-dialog__message {
      margin: 20px 0;
    }
    .success-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `
})
export class SuccessDialogComponent {
  @Input() header: string = 'Congratulations!'; // default header
  @Input() message: string = 'Your action has succeeded!'; // default message
  @Output() confirmed = new EventEmitter<boolean>(); // output event emitter

  /**
   * @description - success dialog method to emit boolean value to parent component
   * @param confirm - boolean value
   */
  confirm(result: boolean) {
    this.confirmed.emit(result);
  }
}
