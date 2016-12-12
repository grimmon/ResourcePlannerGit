import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule, routedComponents } from './dashboard-routing.module';
import { TimespanGridComponent } from '../shared/timespanGrid/timespanGrid.component';
import { ResourceListComponent } from './resourceList/resourceList.component';
import { ResourceDetailsComponent } from './resourceDetails/resourceDetails.component';
import { ResourceFiltersComponent } from './resourceFilters/resourceFilters.component';
import { ResourceProfileComponent } from './resourceProfile/resourceProfile.component';
import { ResourceProjectsComponent } from './resourceProjects/resourceProjects.component';
import { ResourceViewsComponent } from './resourceViews/resourceViews.component';
import { AgGridModule } from 'ag-grid-ng2/main';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AgGridModule,
        DashboardRoutingModule],
    declarations: [
        TimespanGridComponent,
        ResourceListComponent,
        ResourceDetailsComponent,
        ResourceFiltersComponent,
        ResourceProfileComponent,
        ResourceProjectsComponent,
        ResourceViewsComponent,
        routedComponents
    ]
})
export class DashboardModule { }