import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SuccessDialogComponent } from "../../../shared/success-dialog/success-dialog.component"; // Import the success dialog component

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, SuccessDialogComponent],
  template: `
    <div>
      <h1>User Create</h1>
      @if (errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
      }
      <form [formGroup]="newUserForm" (ngSubmit)="addUser();" class="form">
        <div class="form__group">
          <label class="label" for="username">Username<span class="required">*</span></label>
          <input class="input" type="text" formControlName="username" id="username" name="username">
        </div>

        <div class="form__group">
          <label class="label" for="password">Password<span class="required">*</span></label>
          <input type="password" class="input" formControlName="password" id="password" name="password">
        </div>

        <div class="form__group">
          <label class="label" for="password">Email<span class="required">*</span></label>
          <input class="input" type="text" formControlName="email" id="email" name="email">
        </div>

        <div class="form__group">
          <label class="label" for="role">Role<span class="required">*</span></label>
          <select class="select" formControlName="role" id="role" name="role">
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div class="form__actions">
          <input type="submit" class="button button--primary" value="Submit">
        </div>
      </form>
      <br />
      <a class="link link--secondary" routerLink="/user-management/users">Return</a>
    </div>
    @if (showSuccessDialog) {
      <app-success-dialog
        [header]="dialogHeader"
        [message]="dialogMessage"
        (confirmed)="onConfirm($event)">
      </app-success-dialog>
    }
  `,
  styles: ``
})
export class UserCreateComponent {
  errorMessage: string = '';
  dialogHeader: string = '';
  dialogMessage: string = '';
  showSuccessDialog: boolean = false;

  newUserForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    role: [null, Validators.required]
  });

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {}

  addUser() {
    if (!this.newUserForm.valid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const newUser = {
      username: this.newUserForm.value.username,
      passwordHash: this.newUserForm.value.password,
      email: this.newUserForm.value.email,
      role: this.newUserForm.value.role
    };

    console.log('New User', newUser);

    this.http.post(`${environment.apiBaseUrl}/users`, { user: newUser }).subscribe({
      next: (user) => {
        this.dialogHeader = 'Congratulations!'; // Set dialog header text
        this.dialogMessage = 'New user created!'; // Set dialog message text
        this.showSuccessDialog = true; // Open the success dialog
        console.log('User created', user);
      },
      error: (error) => {
        console.error('Error creating user', error);
        this.errorMessage = error.message;
      }
    });
  }

  onConfirm(result: boolean) {
    this.showSuccessDialog = false; // Close the success dialog
    this.router.navigate(['/user-management/users']); // Forward the user back to the main user's page
  }
}