import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {

    // error request
    private errorRequested = new Subject<any>();

    onErrorRequested(handler: (value: any) => void) {
        this.errorRequested.subscribe(handler)
    }
    errorRequest(value: any) {
        this.errorRequested.next(value);
    }

    // categories loaded
    private categoriesLoaded = new Subject<any>();

    onCategoriesLoaded(handler: (value: any) => void) {
        this.categoriesLoaded.subscribe(handler)
    }
    categoriesLoad(value: any) {
        this.categoriesLoaded.next(value);
    }

    // modal mode toggle request
    private modalToggled = new Subject<boolean>();

    onModalToggled(handler: (value: boolean) => void) {
        this.modalToggled.subscribe(handler)
    }
    modalToggle(value: boolean) {
        this.modalToggled.next(value);
    }

    // add assignment request (from Navigation to dashboard)
    private addAssignmentRequested = new Subject<boolean>();

    onAddAssignmentRequested(handler: (value: boolean) => void) {
        this.addAssignmentRequested.subscribe(handler)
    }
    addAssignmentRequest(value: boolean) {
        this.addAssignmentRequested.next(value);
    }

    private editColumnRequested = new Subject<boolean>();

    onEditColumnRequested(handler: (value: boolean) => void) {
        this.editColumnRequested.subscribe(handler)
    }
    editColumnRequest(value: boolean) {
        this.editColumnRequested.next(value);
    }

    // request resource request (from Navigation to dashboard)
    private resourceRequestRequested = new Subject<boolean>();

    onResourceRequestRequested(handler: (value: boolean) => void) {
        this.resourceRequestRequested.subscribe(handler)
    }
    resourceRequestRequest(value: boolean) {
        this.resourceRequestRequested.next(value);
    }

    // filter panel toggle request
    private filterPanelToggled = new Subject<string>();

    onFilterPanelToggled(handler: (value: string) => void) {
        this.filterPanelToggled.subscribe(handler)
    }
    filterPanelToggle() {
        this.filterPanelToggled.next("");
    }

    // resource filter changed
    private resourceFilterChanged = new Subject<any>();

    onResourceFilterChanged(handler: (value: any) => void) {
        this.resourceFilterChanged.subscribe(handler)
    }
    resourceFilterChange(filterType: string, filterValue: any) {
        this.resourceFilterChanged.next({
            type: filterType,
            value: filterValue
        });
    }

    // request to call filtered operation
    private filteredRequested = new Subject<string>();

    onFilteredRequested(handler: (value: string) => void) {
        this.filteredRequested.subscribe(handler)
    }
    filteredRequest(operationType: string) {
        this.filteredRequested.next(operationType);
    }

    // request to export to excel
   private exportRequested = new Subject<string>();

    onExportRequested(handler: (value: string) => void) {
        this.exportRequested.subscribe(handler)
    }
    exportRequest(filters: any) {
        this.exportRequested.next(filters);
    }

    // resource period scroll

    private resourcePeriodScrolled = new Subject<any>();

    onResourcePeriodScrolled(handler: (step: any) => void) {
        this.resourcePeriodScrolled.subscribe(handler)
    }
    resourcePeriodScroll(step: any) {
        this.resourcePeriodScrolled.next(step);
    }

    // request to refresh some of the timeperiod grids

    private timespanGridRefreshRequested = new Subject<any>();

    onTimespanGridRefreshRequested(handler: (gridContext: any) => void) {
        this.timespanGridRefreshRequested.subscribe(handler)
    }
    timespanGridRefreshRequest(gridContext: any) {
        this.timespanGridRefreshRequested.next(gridContext);
    }

    // request to open assignment cell editor

    private assignmentEditorRequested = new Subject<any>();

    onAssignmentEditorRequested(handler: (assignmentInfo: any) => void) {
        this.assignmentEditorRequested.subscribe(handler)
    }
    assignmentEditorRequest(assignmentInfo: any) {
        this.assignmentEditorRequested.next(assignmentInfo);
    }
   
}