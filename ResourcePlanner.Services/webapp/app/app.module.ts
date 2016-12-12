import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import './core/rxjs-extensions';

import { AgGridModule } from 'ag-grid-ng2/main';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './navigation/nav.component';

import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './page-not-found.component';

import { MessageService, EntityService, ServerService, DateService, ExceptionService } from '../app/core';
import { OptionService, ResourceService, ProjectService } from '../app/models';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        AgGridModule.forRoot(),
        AppRoutingModule,
        CoreModule
    ],
    declarations: [
        AppComponent,
        NavComponent,
        PageNotFoundComponent
    ],
    providers: [
        EntityService,
        ExceptionService,
        ServerService,
        DateService,
        MessageService,

        OptionService,
        ResourceService,
        ProjectService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }