import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// ...existing code...
import { AuthService } from '../services/auth.service';
import { Login } from '../models/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const credentials: Login = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;
        // Stocker le token JWT et le nom d'utilisateur dans le localStorage
        if (res && res.access_token) {
          localStorage.setItem('token', res.access_token);
        }
        localStorage.setItem('adminName', credentials.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          this.errorMessage = 'Erreur : ' + err.error.message;
        } else if (err && err.status) {
          this.errorMessage = `Erreur serveur (${err.status})`;
        } else {
          this.errorMessage = 'Identifiants invalides ou erreur serveur.';
        }
        this.loading = false;
      }
    });
  }
}
