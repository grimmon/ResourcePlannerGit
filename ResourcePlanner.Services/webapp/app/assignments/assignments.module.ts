import { NgModule } from '@angular/core';

import { AssignmentsRoutingModule, routedComponents } from './assignments-routing.module';
import { AssignmentNewComponent } from './assignmentNew/assignmentNew.component';
import { AssignmentResourceListComponent } from './assignmentResourceList/assignmentResourceList.component';

@NgModule({
    imports: [AssignmentsRoutingModule],
    declarations: [
        AssignmentNewComponent,
        AssignmentResourceListComponent,
        routedComponents
    ]
})
export class AssignmentsModule { }