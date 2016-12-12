import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignmentAddComponent } from './assignments/assignmentAdd/assignmentAdd.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard', },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
  },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'assignments', component: AssignmentAddComponent, data: { title: 'AssignmentAdd' } },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [
    //AuthGuard,
    //CanDeactivateGuard,
   // UserProfileService
  ]
})
export class AppRoutingModule { }