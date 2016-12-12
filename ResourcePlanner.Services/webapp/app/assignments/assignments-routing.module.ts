import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentAddComponent } from './AssignmentAdd/assignmentAdd.component';

const routes: Routes = [
    { path: '', component: AssignmentAddComponent, data: { title: 'AssignmentAdd'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentsRoutingModule { }

export const routedComponents = [AssignmentAddComponent];