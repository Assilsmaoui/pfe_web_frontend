import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { GestionUtilisateursComponent } from './gestion-utilisateurs/gestion-utilisateurs.component';
import { CreateUserComponent } from './gestion-utilisateurs/create-user.component';

import { GestionTachesComponent } from './gestion-taches/gestion-taches.component';
import { CreateTaskComponent } from './gestion-taches/create-task.component';

import { CaptureUtilisateursComponent } from './capture-utilisateurs/capture-utilisateurs.component';

import { ProjetsComponent } from './projets/projets.component';
import { CreateProjetComponent } from './projets/create-projet.component';
import { ProjetDetailsComponent } from './projets/projet-details.component';
import { AjouterTachesComponent } from './projets/ajouter-taches.component';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { TaskService } from './services/task.service';
import { UserActivityDetailComponent } from './user-activity-detail/user-activity-detail.component';
import { EditTaskComponent } from './gestion-taches/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,

    GestionUtilisateursComponent,
    CreateUserComponent,

    GestionTachesComponent,
    CreateTaskComponent,

    CaptureUtilisateursComponent,

    ProjetsComponent,
    CreateProjetComponent,
    ProjetDetailsComponent,
    AjouterTachesComponent,

    NavbarComponent,
    SidebarComponent,

    UserDetailComponent,
     UserActivityDetailComponent,
     EditTaskComponent
  ],

  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],

  providers: [
    TaskService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }