import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  constructor(private userService: UserService, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const rawPassword = (form['password'] as HTMLInputElement).value;
    const cleanedPassword = rawPassword.replace(/\0/g, '').trim();
    const user = {
      username: (form['username'] as HTMLInputElement).value.trim(),
      email: (form['email'] as HTMLInputElement).value.trim(),
      domaine: (form['domaine'] as HTMLInputElement).value.trim(),
      password: cleanedPassword,
      is_active: false
    };
    this.userService.registerUser(user).subscribe({
      next: () => this.router.navigate(['/gestion-utilisateurs']),
      error: err => {
        let msg = 'Erreur lors de la création : ';
        if (err?.error) {
          if (typeof err.error === 'string') {
            msg += err.error;
          } else if (err.error.message) {
            msg += err.error.message;
          } else {
            msg += JSON.stringify(err.error);
          }
        } else {
          msg += err.statusText || 'Erreur inconnue';
        }
        alert(msg);
      }
    });
  }
}
