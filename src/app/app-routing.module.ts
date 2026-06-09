import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { GestionUtilisateursComponent } from './gestion-utilisateurs/gestion-utilisateurs.component';
import { GestionTachesComponent } from './gestion-taches/gestion-taches.component';
import { CaptureUtilisateursComponent } from './capture-utilisateurs/capture-utilisateurs.component';
import { EditTaskComponent } from './gestion-taches/edit-task/edit-task.component';
import { AuthGuard } from './guards/auth.guard';

import { CreateUserComponent } from './gestion-utilisateurs/create-user.component';
import { CreateTaskComponent } from './gestion-taches/create-task.component';

import { ProjetsComponent } from './projets/projets.component';
import { CreateProjetComponent } from './projets/create-projet.component';
import { ProjetDetailsComponent } from './projets/projet-details.component';
import { AjouterTachesComponent } from './projets/ajouter-taches.component';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserActivityDetailComponent } from './user-activity-detail/user-activity-detail.component';

const routes: Routes = [

  // ================= AUTH =================
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // ================= DASHBOARD =================
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // ================= USERS =================
  { path: 'gestion-utilisateurs', component: GestionUtilisateursComponent, canActivate: [AuthGuard] },

  { path: 'gestion-utilisateurs/ajouter', component: CreateUserComponent, canActivate: [AuthGuard] },

  { path: 'create-user/:id', component: CreateUserComponent, canActivate: [AuthGuard] },

  // ================= TASKS =================
  { path: 'gestion-taches', component: GestionTachesComponent, canActivate: [AuthGuard] },

  { path: 'gestion-taches/ajouter', component: CreateTaskComponent, canActivate: [AuthGuard] },
    { path: 'gestion-tasks/:taskId/edit', component: EditTaskComponent, canActivate: [AuthGuard] },


  // ⭐ AJOUT UPDATE TASK (SANS CASSE)
  { path: 'tasks/:taskId/edit', component: AjouterTachesComponent },
  // ================= PROJETS =================
  { path: 'projets', component: ProjetsComponent, canActivate: [AuthGuard] },

  { path: 'projets/ajouter', component: CreateProjetComponent, canActivate: [AuthGuard] },

  { path: 'create-projet/:id', component: CreateProjetComponent, canActivate: [AuthGuard] },

  { path: 'projets/:id/details', component: ProjetDetailsComponent, canActivate: [AuthGuard] },

  { path: 'projets/:id/ajouter-taches', component: AjouterTachesComponent, canActivate: [AuthGuard] },

  // ================= ACTIVITIES =================
  { path: 'activites-utilisateurs', component: CaptureUtilisateursComponent, canActivate: [AuthGuard] },

  // ================= USER DETAIL =================
  { path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AuthGuard] },

  // ================= TASK ACTIVITY DETAIL =================
  { path: 'user-activity-detail/:id', component: UserActivityDetailComponent, canActivate: [AuthGuard] },

  { path: 'tasks/:id/activity', component: UserActivityDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }