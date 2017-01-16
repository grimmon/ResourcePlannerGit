import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Option, OptionService, ResourceService, ResourceRequest } from '../../models';
import { CONFIG } from '../../core';


@Component({
    moduleId: module.id.toString(),
    selector: 'resource-request',
    templateUrl: 'resourceRequest.component.html',
    styleUrls: ['resourceRequest.component.css'],
    inputs: [
        'showTrigger'
    ]
})
export class ResourceRequestComponent implements OnDestroy, OnInit {

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
            this.saving = false;
        }
    }
    private _showTrigger = 0;

    visible = false;

    saving = false;


    requestResource: Option;
    requestResourceSource: any;
    requestResourceListFormatter: any;

    requestProject: Option;
    requestProjectSource: any;
    requestProjectListFormatter: any;

    resourceRequest: ResourceRequest;

    startDateChanged($event: any) {
        this.resourceRequest.StartDate = $event.target.value;
        this.resourceRequest.EndDate = this.dateService.max(this.resourceRequest.StartDate, this.resourceRequest.EndDate);
    }

    endDateChanged($event: any) {
        this.resourceRequest.EndDate = $event.target.value;
        this.resourceRequest.StartDate = this.dateService.min(this.resourceRequest.EndDate, this.resourceRequest.StartDate);
    }

    save() {
        var errors = this.validate();
        if (errors) {
            this.messageService.errorRequest({
                message: 'Save cannot be done because of the following:',
                messages: errors
            });
            return;
        }

        this.resourceRequest.ResourceId = this.requestResource.Id;
        this.resourceRequest.ProjectMasterId = this.requestProject.Id;

        this.saving = true;

        this.resourceService
            .requestResource(this.resourceRequest)
            .subscribe(res => {
                this.saving = false;
                this.close();
            });
    }

    private validate() {
        var errors: any[] = [];
        if (!this.requestResource) {
            errors.push('Resource must be selected or added.');
        }
        if (!this.requestProject) {
            errors.push('Project must be selected or added.');
        }
        return errors.length ? errors : null;
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }
    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private resourceService: ResourceService) {

        this.requestResourceSource = this.optionService.setSource(CONFIG.urls.manager);
        this.requestResourceListFormatter = this.optionService.setListFormatter();

        this.requestProjectSource = this.optionService.setSource(CONFIG.urls.project);
        this.requestProjectListFormatter = this.optionService.setListFormatter();

        this.resourceRequest = new ResourceRequest({
            ResourceId: 0,
            ProjectMasterId: 0,
            StartDate: this.dateService.format(new Date()),
            EndDate: this.dateService.format(new Date()),
            Hours: 0,
            Comments: ''
        });
    }


    ngOnInit() {
    }

    ngOnDestroy() {
    }
}