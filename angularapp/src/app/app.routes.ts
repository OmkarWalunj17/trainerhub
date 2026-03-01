import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { TrainerDetailsComponent } from './components/trainer-details/trainer-details.component';
import { authguardGuard } from './components/authguard/authguard.guard';
import { TrainerManagementComponent } from './components/trainer-management/trainer-management.component';
import { ManagerRequirementComponent } from './components/manager-requirement/manager-requirement.component';
import { ManagerViewRequirementsComponent } from './components/manager-view-requirements/manager-view-requirements.component';
import { SelectedTrainersComponent } from './components/selected-trainers/selected-trainers.component';
import { ManagerviewfeedbackComponent } from './components/managerviewfeedback/managerviewfeedback.component';
import { CoordinatorViewTrainersComponent } from './components/coordinator-view-trainers/coordinator-view-trainers.component';
import { CoordinatorViewRequirementsComponent } from './components/coordinator-view-requirements/coordinator-view-requirements.component';
import { CoordinatorviewfeedbackComponent } from './components/coordinatorviewfeedback/coordinatorviewfeedback.component';
import { ErrorComponent } from './components/error/error.component';
import { ManagerpostfeedbackComponent } from './components/managerpostfeedback/managerpostfeedback.component';
import { OtpComponent } from './components/otp/otp.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { VerificationSentComponent } from './components/verification-sent/verification-sent.component';

const routes: Routes = [
  {
    path: 'homepage',
    component: HomePageComponent
  },
  {
    path: 'register',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    // route for adding requirements by manager role
    path:'add-requirement',
    component:ManagerRequirementComponent,
    canActivate : [authguardGuard],
    data :{roles: ['MANAGER']}
  }, 
  {
    // route for adding requirements by manager role
    path:'update-requirement/:id',
    component:ManagerRequirementComponent,
    canActivate : [authguardGuard],
    data :{roles: ['MANAGER']}
  },
  {
    // route for viewing requirements by manager role
    path:'view-requirements',
    component:ManagerViewRequirementsComponent,
    canActivate : [authguardGuard],
    data :{roles: ['MANAGER']}
  },
  {
    // route for viewing the selected trainers by manager role
    path:'selected-trainers',
    component:SelectedTrainersComponent,
    canActivate : [authguardGuard],
    data :{roles: ['MANAGER']}
  },
  {
    // route for viewing the trainer feedbacks by manager role 
    path:'manager-view-feedbacks',
    component:ManagerviewfeedbackComponent,
    canActivate : [authguardGuard],
    data :{roles: ['MANAGER']}
  },
  {
    path:'manager-post-feedback/:id',
    component:ManagerpostfeedbackComponent,
    canActivate : [authguardGuard],
    data : {roles : ['MANAGER']}
  },
  {
    // route for adding a new trainer by coordinator role 
    path:'add-trainer',
    component:TrainerManagementComponent,
    canActivate : [authguardGuard],
    data :{roles: ['COORDINATOR']}
  },
  {
    // route for adding a new trainer by coordinator role 
    path:'add-trainer/:id',
    component:TrainerManagementComponent,
    canActivate : [authguardGuard],
    data :{roles: ['COORDINATOR']}
  },
  {
    // route for viewing the trainers added by coordinator role 
    path:'view-trainers',
    component:CoordinatorViewTrainersComponent,
    canActivate : [authguardGuard],
    data :{roles: ['COORDINATOR']}
  },
  {
    // route for viewing the current requirements by coordinator role
    path:'available-requirements',
    component:CoordinatorViewRequirementsComponent,
    canActivate : [authguardGuard],
    data :{roles: ['COORDINATOR']}
  },
  { path: 'trainer-details/:requirementId/:trainerId', component: TrainerDetailsComponent },
  {
    // route for viewing feedbacks by coordinator role 
    path:'coordinator-view-feedbacks',
    component:CoordinatorviewfeedbackComponent,
    canActivate : [authguardGuard],
    data :{roles: ['COORDINATOR']}
  },
  {
    path:'verify-otp',
    component:OtpComponent,
  },
  {
    path: 'verify-email', 
    component: VerifyEmailComponent,
  },
  {
    path: 'verification-sent', 
    component: VerificationSentComponent,
  },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full'
  },
  {
    path:"**",
    component:ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
