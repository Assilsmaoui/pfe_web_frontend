
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionUtilisateursComponent } from './gestion-utilisateurs/gestion-utilisateurs.component';
import { CreateUserComponent } from './gestion-utilisateurs/create-user.component';
import { GestionTachesComponent } from './gestion-taches/gestion-taches.component';
import { ActivitesUtilisateursComponent } from './activites-utilisateurs/activites-utilisateurs.component';
import { CreateTaskComponent } from './gestion-taches/create-task.component';

import { ProjetsComponent } from './projets/projets.component';
import { CreateProjetComponent } from './projets/create-projet.component';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { ProjetDetailsComponent } from './projets/projet-details.component';
import { AjouterTachesComponent } from './projets/ajouter-taches.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    GestionUtilisateursComponent,
    GestionTachesComponent,
    NavbarComponent,
    SidebarComponent,
    CreateUserComponent,
    CreateTaskComponent,
    // ProjetsComponent (standalone)
    CreateProjetComponent,
    ProjetDetailsComponent,
    AjouterTachesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ProjetsComponent
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
