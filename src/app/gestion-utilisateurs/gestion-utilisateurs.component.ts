import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WsUserStatusService } from '../services/ws-user-status.service';

@Component({
  selector: 'app-gestion-utilisateurs',
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrls: ['./gestion-utilisateurs.component.css']
})
export class GestionUtilisateursComponent implements OnInit, OnDestroy {

  users: User[] = [];
  loading = false;
  error = '';

  showAddUserForm = false;
  addUserForm: FormGroup;
  addUserError = '';
  addUserSuccess = '';

  page = 1;
  pageSize = 8;
  total = 0;

  // ===== MODAL DELETE =====
  showDeleteModal = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private wsStatus: WsUserStatusService
  ) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      domaine: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchPaginatedUsers();

    this.wsStatus.connect('admin', (data: any) => {
      if (!data || data.type !== 'status') return;

      this.users = this.users.map(user => {
        if (String(user._id) === String(data.user_id)) {
          return { ...user, is_active: data.is_active };
        }
        return user;
      });
    });
  }

  ngOnDestroy() {
    this.wsStatus.disconnect();
  }

  // ================= LIST USERS =================
  fetchPaginatedUsers(page: number = this.page) {
    this.loading = true;

    this.userService.getPaginatedUsers(page, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.users.filter((u: any) => !u.is_deleted);
        this.page = data.page;
        this.pageSize = data.page_size;
        this.total = data.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  // ================= EDIT =================
  editUser(user: User) {
    const userId = user._id || user.id;
    if (!userId) return;

    this.router.navigate(['/create-user', userId]);
  }

  // ================= DELETE MODAL =================
  openDeleteModal(user: User) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    const userId = String(this.userToDelete._id || this.userToDelete.id);
    if (!userId) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.fetchPaginatedUsers(this.page);
        this.closeDeleteModal();
      },
      error: () => {
        this.error = "Erreur lors de la suppression";
        this.closeDeleteModal();
      }
    });
  }

  // ================= PAGINATION =================
  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.fetchPaginatedUsers(newPage);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // ================= ADD USER =================
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

    const userData = this.addUserForm.value;

    this.userService.registerUser(userData).subscribe({
      next: () => {
        this.addUserSuccess = "Utilisateur ajouté avec succès.";
        this.fetchPaginatedUsers(1);
        this.addUserForm.reset();
        this.showAddUserForm = false;
      },
      error: (err) => {
        this.addUserError = err?.error?.message || 'Erreur lors de l\'ajout.';
      }
    });
  }

  // ================= UTILS =================
  getUserId(user: User): string | null {
    return user._id || String(user.id || '');
  }

  goToUserDetail(userId: string | null) {
    if (!userId) return;
    this.router.navigate(['/user-detail', userId]);
  }
}