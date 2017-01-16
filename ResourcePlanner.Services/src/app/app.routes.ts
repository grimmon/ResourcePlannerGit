import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard'
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**',    component: NoContentComponent },
];
