import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Resource, ResourcePage, ResourceRow, ResourceService, TimeAggregation } from '../../models';


@Component({
    moduleId: module.id,
    selector: 'resource-list',
    templateUrl: 'resourceList.component.html',
    styleUrls: ['resourceList.component.css'],
})
export class ResourceListComponent implements OnDestroy, OnInit {

    gridConfig: any = {
        getItems: (page: ResourcePage) => page.Resources,
        createRow: ResourceRow,
        height: "100%",
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
        this.messageService.resourcePeriodScroll($event); // announce that resource selection done
    }

    rowSelected($event: any) {
        this.messageService.resourceSelect($event.rowData); // announce that resource selection done
    }

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private resourceService: ResourceService,
        private route: ActivatedRoute,
        private router: Router) {

        this.messageService.onApplyRequested(filters => this.apply(filters));

        this.messageService.onExportRequested(filters => this.doExport(filters));

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
            },
            {
                context: { type: "resourceColumn", index: 1 },
                headerName: "Position",
                field: "Position",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context:
                { type: "resourceColumn", index: 2 },
                headerName: "City",
                field: "City",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 3 },
                headerName: "Practice",
                field: "Practice",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 4 },
                headerName: "Sub-Practice",
                field: "SubPractice",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
            {
                context: { type: "resourceColumn", index: 5 },
                headerName: "Resource Mgr.",
                field: "ResourceManager",
                width: 150,
                suppressMenu: true,
                pinned: 'left'
            },
        ];

    }

    private doExport(filters: any) {
        //this.resourceService.export(filters + this.getDateQuery());
    }

    private apply(filters: any) {
        this.queryConfig.query = filters;
        this.applyTrigger++;
    }

    ngOnDestroy() {
    }
}