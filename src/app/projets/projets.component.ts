// ...existing code...
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {

  // ================= USERS =================
  users: any[] = [];

  getUsernameById(id: string | undefined): string {
    if (!id) return '';
    const user = this.users?.find((u: any) => u._id === id);
    return user ? user.username : id;
  }

  // ================= UI REF =================
  @ViewChild('listeProjets') listeProjets!: ElementRef;

  // ================= DATA =================
  projets: any[] = [];
  showAddForm = false;

  page = 1;
  pageSize = 3;
  total = 0;

  newProjet = {
    nom_projet: '',
    description: '',
    statut: '',
    date_debut: '',
    date_fin: '',
    membres: [] as string[]
  };

  // ================= DELETE MODAL =================
  showDeleteModal = false;
  projectToDelete: any = null;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPaginatedProjects();

    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // ================= LIST =================
  fetchPaginatedProjects(page: number = this.page) {
    this.projectService.getPaginatedProjects(page, this.pageSize)
      .subscribe(data => {
        this.projets = data.projects;
        this.page = data.page;
        this.pageSize = data.page_size;
        this.total = data.total;
      });
  }

  // ================= PAGINATION =================
  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.fetchPaginatedProjects(newPage);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // ================= CREATE =================
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProjet() {
    this.projectService.addProject(this.newProjet).subscribe(() => {
      this.fetchPaginatedProjects();

      this.newProjet = {
        nom_projet: '',
        description: '',
        statut: '',
        date_debut: '',
        date_fin: '',
        membres: []
      };

      this.showAddForm = false;

      setTimeout(() => {
        if (this.listeProjets) {
          this.listeProjets.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    });
  }

  // ================= EDIT =================
  editProject(project: any) {
    console.log("CLICK PROJECT =", project);

    const projectId = project?._id;

    console.log("PROJECT ID =", projectId);

    if (!projectId) return;

    this.router.navigate(['/create-projet', projectId]);
  }

  // ================= DELETE MODAL =================
  openDeleteModal(project: any) {
    this.projectToDelete = project;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  confirmDelete() {
    if (!this.projectToDelete?._id) return;

    this.projectService.deleteProject(this.projectToDelete._id)
      .subscribe({
        next: () => {
          this.fetchPaginatedProjects(this.page);
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error("DELETE ERROR", err);
          this.closeDeleteModal();
        }
      });
  }
}