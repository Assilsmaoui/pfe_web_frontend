import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  userId: string | null = null;
  isEditMode = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.isEditMode = true;

      this.userService.getUserById(this.userId).subscribe(user => {
        const form = document.querySelector('form') as HTMLFormElement;

        (form['username'] as HTMLInputElement).value = user.username;
        (form['email'] as HTMLInputElement).value = user.email;
        (form['domaine'] as HTMLInputElement).value = user.domaine;
      });
    }
  }

  retour() {
    this.router.navigate(['/gestion-utilisateurs']);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const user = {
      username: (form['username'] as HTMLInputElement).value.trim(),
      email: (form['email'] as HTMLInputElement).value.trim(),
      domaine: (form['domaine'] as HTMLInputElement).value.trim(),
      is_active: false
    };

    // CREATE
    if (!this.isEditMode) {
      const password = (form['password'] as HTMLInputElement).value
        .replace(/\0/g, '')
        .trim();

      const newUser = {
        ...user,
        password
      };

      this.userService.registerUser(newUser).subscribe({
        next: () => this.router.navigate(['/gestion-utilisateurs']),
        error: () => alert('Erreur création')
      });
    }

    // UPDATE
    else {
      this.userService.updateUser(this.userId!, user).subscribe({
        next: () => this.router.navigate(['/gestion-utilisateurs']),
        error: () => alert('Erreur update')
      });
    }
  }
}