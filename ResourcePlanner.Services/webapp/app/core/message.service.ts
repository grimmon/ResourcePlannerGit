import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {

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

    // apply filters request

    private applyRequested = new Subject<any>();

    onApplyRequested(handler: (value: any) => void) {
        this.applyRequested.subscribe(handler)
    }
    applyRequest(filters: any) {
        this.applyRequested.next(filters);
    }

    // resource selection

    private resourceSelected = new Subject<any>();

    onResourceSelected(handler: (resourceRow: any) => void) {
        this.resourceSelected.subscribe(handler)
    }
    resourceSelect(resourceRow: any) {
        this.resourceSelected.next(resourceRow);
    }

    // resource period scroll

    private resourcePeriodScrolled = new Subject<any>();

    onResourcePeriodScrolled(handler: (step: any) => void) {
        this.resourcePeriodScrolled.subscribe(handler)
    }
    resourcePeriodScroll(step: any) {
        this.resourcePeriodScrolled.next(step);
    }
}