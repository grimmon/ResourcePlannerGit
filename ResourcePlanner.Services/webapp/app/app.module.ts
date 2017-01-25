import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import './core/rxjs-extensions';

import { AgGridModule } from 'ag-grid-ng2/main';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { UiSwitchModule } from 'angular2-ui-switch';
import { LocalStorageModule } from 'angular-2-local-storage';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './navigation/nav.component';
import { ErrorComponent } from './error/error.component';
import { TimespanGridComponent } from './shared/timespanGrid/timespanGrid.component';
import { HoursEditorComponent } from './shared/hoursEditor/hoursEditor.component';
import { PopupComponent } from './shared/popup/popup.component';

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
import { EditColumnsComponent } from './dashboard/EditColumns/editColumns.component';

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
        UiSwitchModule,

        //NgbModule.forRoot(),
        AgGridModule.forRoot(),
        Ng2AutoCompleteModule,
        LocalStorageModule.withConfig({
            prefix: 'my-app',
            storageType: 'localStorage'
        }),
        AppRoutingModule,
        CoreModule
    ],
    declarations: [
        AppComponent,
        TimespanGridComponent,
        HoursEditorComponent,
        PopupComponent,

        ErrorComponent,
        NavComponent,
        PageNotFoundComponent,

        DashboardComponent,
        ResourceListComponent, ResourceDetailsComponent, ResourceFiltersComponent, ResourceProfileComponent, ResourceProjectsComponent, ResourceViewsComponent,
        ProjectListViewComponent, ProjectAddComponent, AssignmentAddComponent, ResourceRequestComponent, EditColumnsComponent
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