
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { GestionUtilisateursComponent } from './gestion-utilisateurs/gestion-utilisateurs.component';
import { GestionTachesComponent } from './gestion-taches/gestion-taches.component';
import { ActivitesUtilisateursComponent } from './activites-utilisateurs/activites-utilisateurs.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'gestion-utilisateurs', component: GestionUtilisateursComponent, canActivate: [AuthGuard] },
  { path: 'gestion-taches', component: GestionTachesComponent, canActivate: [AuthGuard] },
  { path: 'activites-utilisateurs', component: ActivitesUtilisateursComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
