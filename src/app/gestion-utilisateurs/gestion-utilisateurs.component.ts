import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-utilisateurs',
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrls: ['./gestion-utilisateurs.component.css']
})
export class GestionUtilisateursComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  showAddUserForm = false;
  addUserForm: FormGroup;
  addUserError = '';
  addUserSuccess = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      domaine: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
    this.addUserError = '';
    this.addUserSuccess = '';
    this.addUserForm.reset();
  }

  onAddUserSubmit() {
    if (this.addUserForm.invalid) {
      this.addUserError = 'Veuillez remplir tous les champs correctement.';
      return;
    }
    this.addUserError = '';
    this.addUserSuccess = '';
    const userData = this.addUserForm.value;
    this.userService.registerUser(userData).subscribe({
      next: (res) => {
        this.addUserSuccess = "Utilisateur ajouté avec succès.";
        this.fetchUsers();
        this.addUserForm.reset();
        this.showAddUserForm = false;
      },
      error: (err) => {
        this.addUserError = err?.error?.message || 'Erreur lors de l\'ajout de l\'utilisateur.';
      }
    });
  }
}
