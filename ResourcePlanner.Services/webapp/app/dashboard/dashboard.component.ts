import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MessageService, EntityService } from '../core';
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
        this.resource = $event ? this.entityService.clone($event) : $event;
    }

    resourceRequestShow = 0;
    resourceRequestRequested() {
        this.resourceRequestShow++;
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

    editColumnShow = 0;
    editColumnRequested() {
        this.editColumnShow++;
    }

    columnEdited() {

    }

    addProjectShow = 0;
    addProjectRequested() {
        this.addProjectShow++;
    }

    assignmentInfo: any;

    constructor(
        private entityService: EntityService,
        private messageService: MessageService) {

        this.messageService.onAddAssignmentRequested(state => {
            this.assignmentAddRequested();
        });

        this.messageService.onEditColumnRequested(state => {
            this.editColumnRequested();
        });

        this.messageService.onAssignmentEditorRequested(assignmentInfo => {
            this.assignmentInfo = assignmentInfo;
        });

        this.messageService.onResourceRequestRequested(state => {
            this.resourceRequestRequested();
        })
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}