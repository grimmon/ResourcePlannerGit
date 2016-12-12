import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListViewComponent } from './projectListView/projectListView.component';

const routes: Routes = [
    { path: '', component: ProjectListViewComponent, data: { title: 'ProjectsListView'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule { }

export const routedComponents = [ProjectListViewComponent];