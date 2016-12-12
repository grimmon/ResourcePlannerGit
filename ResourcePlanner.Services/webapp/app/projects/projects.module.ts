import { NgModule } from '@angular/core';

import { ProjectsRoutingModule, routedComponents } from './projects-routing.module';
import { ProjectListViewComponent } from './projectListView/projectListView.component';
import { ProjectAddComponent } from './projectAdd/projectAdd.component';
import { TimespanGridComponent } from '../shared/timespanGrid/timespanGrid.component';

@NgModule({
    imports: [ProjectsRoutingModule],
    declarations: [
        ProjectListViewComponent,
        ProjectAddComponent,
        routedComponents
    ]
})
export class ProjectsModule { }