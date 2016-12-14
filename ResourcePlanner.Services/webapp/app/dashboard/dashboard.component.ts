import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../core';
import { CategoryOption } from '../models';


@Component({
    moduleId: module.id,
    selector: 'resource-planner-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {

    filterQuery = ''
    applyFiltersRequested($event: any) {
        this.filterQuery = $event;
    }

    resource: any
    resourceSelected($event: any) {
        this.resource = $event;
    }

    projectShow = 0;
    projectToView: any = {};
    projectResourceViewRequested($event: any) {
        this.projectToView = $event; 
        this.projectShow++;
    }

    assignmentAddShow = 0;
    assignmentAddRequested() {
        this.assignmentAddShow++;
    }

    addProjectShow = 0;
    addProjectRequested() {
        this.addProjectShow++;
    }

    constructor(
        private messageService: MessageService) {

        this.messageService.onAddAssignmentRequested(state => {
            this.assignmentAddRequested();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}