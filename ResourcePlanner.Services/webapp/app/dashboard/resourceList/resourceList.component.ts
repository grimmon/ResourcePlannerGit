import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Resource, ResourcePage, ResourceRow, ResourceService, TimeAggregation, OptionService } from '../../models';


@Component({
    moduleId: module.id,
    selector: 'resource-list',
    templateUrl: 'resourceList.component.html',
    styleUrls: ['resourceList.component.css'],
    inputs: [
        'filterQuery'
    ]
})
export class ResourceListComponent implements OnDestroy, OnInit {

    @Output() resourceSelected: EventEmitter<any>;
    @Output() popupRequested: EventEmitter<any>;

    panelHeightWithFilters: string = "76%";
    panelHeight: string = this.panelHeightWithFilters;
    takeHeightOfFilters = false;

    set filterQuery(v: any) {
        this.queryConfig.query = v.filterQuery;
        this.applyTrigger++;
        this.resourceSelected.emit(null);
   }

    gridConfig: any = {
        context: "resource-list",
        refreshContexts: ["resource-projects", "resource-list"],
        getItems: (page: ResourcePage) => page.Resources,
        createRow: ResourceRow,
        showTimePeriodScroll: true,
        height: "100%",
        handleContext: (event: any) => {
            var field = event.colDef.field,
                periodIndex = parseInt(field.substr(0, field.indexOf('-'), 10)),
                periodStart = this.dateService.moveDate(this.queryConfig.startDate, TimeAggregation.Weekly, periodIndex),
                value = event.value;
            if (field.indexOf('ResourceHours') > 0 && value) {
                this.popupRequested.emit({
                    event: event.event,
                    resourceId: event.data.Id,
                    periodStart: periodStart,
                    periodEnd: this.dateService.moveDate(periodStart, TimeAggregation.Daily, 6)
                });
            }
        } 
    };

    queryConfig: any = {
        aggregation: TimeAggregation.Weekly,
        query: "",
    };

    applyTrigger: number = 0;

    dataRequested($event: any) {
        $event.dataObservable = this.resourceService.getResourcePage($event.query);
    }

    periodScrolled($event: any) {
        this.dateQuery = $event.query;
        var event = {
            step: $event.direction,
            newDate: $event.newDate
        };
        this.messageService.resourcePeriodScroll(event); 
    }
    dateQuery: string = ''

    rowSelected($event: any) {
        this.resourceSelected.emit($event.rowData)
    }

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService,
        private optionService: OptionService    ) {

        this.resourceSelected = new EventEmitter<any>();
        this.popupRequested = new EventEmitter<any>();

        this.messageService.onExportRequested(exportInfo => this.doExport(exportInfo));

        this.messageService.onResourceFilterChanged(filterInfo => {
            switch (filterInfo.type) {
                case 'cleared':
                    this.queryConfig.aggregation = filterInfo.value.aggregation;
                    break;
                case 'aggregation':
                    this.queryConfig.aggregation = filterInfo.value;
                    break;
            }
        });

        this.messageService.onFilterPanelToggled(state => {
            this.panelHeight = (this.takeHeightOfFilters = !this.takeHeightOfFilters) ? "100%" : this.panelHeightWithFilters;
        });


        this.createColumns();
    }

    ngOnInit() {
    }

    private createColumns() {
        this.gridConfig.columns = [
            {
                context: {
                    type: "resourceColumn",
                    index: 0
                },
                headerName: "Resource",
                field: "ResourceName",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Resource Name") || false
            },
            {
                context: { type: "resourceColumn", index: 1 },
                headerName: "Position",
                field: "Position",
                width: 150,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Position") || false
            },
            {
                context:
                { type: "resourceColumn", index: 2 },
                headerName: "Delivery City",
                field: "City",
                width: 100,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("City") || false
            },
            {
                context:
                { type: "resourceColumn", index: 3 },
                headerName: "Home City",
                field: "HomeCity",
                width: 100,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Home City") || false
            }, 
            {
                context: { type: "resourceColumn", index: 4 },
                headerName: "Practice",
                field: "Practice",
                width: 100,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Practice") || false
            },

            {
                context: { type: "resourceColumn", index: 5 },
                headerName: "Sub-Practice",
                field: "SubPractice",
                width: 100,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Sub-practice") || false
            },
            {
                context: { type: "resourceColumn", index: 6 },
                headerName: "Resource Mgr.",
                field: "ResourceManager",
                width: 100,
                suppressMenu: true,
                pinned: 'left',
                hide: this.optionService.getResourceColumnOption("Resource Mgr") || false
            },
        ];

    }

    private doExport(exportInfo: any) {
        this.resourceService.export(exportInfo.query + this.dateQuery, exportInfo.callback);
    }

    ngOnDestroy() {
    }
}