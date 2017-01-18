import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

import { AgGridModule } from 'ag-grid-ng2/main';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { UiSwitchModule } from 'angular2-ui-switch';
import { LocalStorageModule } from 'angular-2-local-storage';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

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
import { EditColumnsComponent } from './dashboard/EditColumns/EditColumns.component';

import { CoreModule } from './core/core.module';

import { MessageService, EntityService, ServerService, DateService, ExceptionService, AdalService } from './core';
import { OptionService, ResourceService, ProjectService } from '../app/models';

import { NoContentComponent } from './no-content';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
	TimespanGridComponent,
    HoursEditorComponent,

    ErrorComponent,
    NavComponent,
	DashboardComponent,
    ResourceListComponent, ResourceDetailsComponent, ResourceFiltersComponent, ResourceProfileComponent, ResourceProjectsComponent, ResourceViewsComponent,
    ProjectListViewComponent, ProjectAddComponent, AssignmentAddComponent, ResourceRequestComponent, EditColumnsComponent,
    NoContentComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
	AgGridModule.withComponents([]),
    CoreModule,
    Ng2AutoCompleteModule,
    LocalStorageModule.withConfig({
        prefix: 'my-app',
        storageType: 'localStorage'
    })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    EntityService,
    ExceptionService,
    ServerService,
    DateService,
    MessageService,
    AdalService,

    OptionService,
    ResourceService,
    ProjectService,
	ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
