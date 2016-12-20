import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import './core/rxjs-extensions';

import { AgGridModule } from 'ag-grid-ng2/main';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './navigation/nav.component';
import { ErrorComponent } from './error/error.component';
import { TimespanGridComponent } from './shared/timespanGrid/timespanGrid.component';
import { HoursEditorComponent } from './shared/hoursEditor/hoursEditor.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ResourceListComponent } from './dashboard/resourceList/resourceList.component';
import { ResourceDetailsComponent } from './dashboard/resourceDetails/resourceDetails.component';
import { ResourceFiltersComponent } from './dashboard/resourceFilters/resourceFilters.component';
import { ResourceProfileComponent } from './dashboard/resourceProfile/resourceProfile.component';
import { ResourceProjectsComponent } from './dashboard/resourceProjects/resourceProjects.component';
import { ResourceViewsComponent } from './dashboard/resourceViews/resourceViews.component';
import { ProjectListViewComponent } from './dashboard/projectListView/projectListView.component';
import { ProjectAddComponent } from './dashboard/projectAdd/projectAdd.component';
import { AssignmentAddComponent } from './dashboard/assignmentAdd/assignmentAdd.component';
import { ResourceRequestComponent } from './dashboard/resourceRequest/resourceRequest.component';

import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './page-not-found.component';

import { MessageService, EntityService, ServerService, DateService, ExceptionService, AdalService } from '../app/core';
import { OptionService, ResourceService, ProjectService } from '../app/models';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        CommonModule,

        AgGridModule.forRoot(),
        Ng2AutoCompleteModule,

        AppRoutingModule,
        CoreModule
    ],
    declarations: [
        AppComponent,
        TimespanGridComponent,
        HoursEditorComponent,

        ErrorComponent,
        NavComponent,
        PageNotFoundComponent,

        DashboardComponent,
        ResourceListComponent, ResourceDetailsComponent, ResourceFiltersComponent, ResourceProfileComponent, ResourceProjectsComponent, ResourceViewsComponent,
        ProjectListViewComponent, ProjectAddComponent, AssignmentAddComponent, ResourceRequestComponent
    ],
    providers: [
        EntityService,
        ExceptionService,
        ServerService,
        DateService,
        MessageService,
        AdalService,

        OptionService,
        ResourceService,
        ProjectService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }