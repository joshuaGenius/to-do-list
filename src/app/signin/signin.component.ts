import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }
  signinForm!: FormGroup;
  loginError!: string;
  loadingdata: boolean = true;


  ngOnInit() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }
  login() {
    const email = this.signinForm.get('email')?.value;
    const password = this.signinForm.get('password')?.value;

    if (!email || !password) {
      this.snackBar.open('Email and password are required.', 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const username = email.split('@')[0];
    const domain = email.split('@')[1];

    if (domain !== 'gmail.com') {
      this.snackBar.open('Only @gmail.com addresses are allowed.', 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (password === username) {
      this.loadingdata = false;
      this.authService.login(username)
      this.snackBar.open('Signin successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      })
      this.router.navigate(['/list'], {
        state: { username }
      })
    } else {
      this.snackBar.open('Invalid email or password.', 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

}
