import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, DateService } from '../../core';
import { Option, OptionService, ProjectService, AddProject } from '../../models';
import { CONFIG } from '../../core';


@Component({
    moduleId: module.id,
    selector: 'project-add',
    templateUrl: 'projectAdd.component.html',
    styleUrls: ['projectAdd.component.css'],
    inputs: [
        'showTrigger'
    ]
})
export class ProjectAddComponent implements OnDestroy, OnInit {

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

    client: Option;
    clientSource: any;
    clientListFormatter: any;
    clientSelectorVisible = true;
    clientName = '';

    openAddClient() {
        this.clientSelectorVisible = false;
    }

    clientNameChanged($event: any) {
    }

    projectManager: Option;
    projectManagerSource: any;
    projectManagerListFormatter: any;

    opportunityOwner: Option;
    opportunityOwnerSource: any;
    opportunityOwnerListFormatter: any;

    addedProject: AddProject;

    startDateChanged($event: any) {
        this.addedProject.StartDate = $event.target.value;
        this.addedProject.EndDate = this.dateService.max(this.addedProject.StartDate, this.addedProject.EndDate);
    }

    endDateChanged($event: any) {
        this.addedProject.EndDate = $event.target.value;
        this.addedProject.StartDate = this.dateService.min(this.addedProject.EndDate, this.addedProject.StartDate);
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

        if (!this.client) {
            this.addedProject.CustomerName = this.clientName;
        }
        else {
            this.addedProject.CustomerId = this.client.Id;
        }
        this.addedProject.ProjectManagerId = this.projectManager.Id;
        this.addedProject.OpportunityOwnerId = this.opportunityOwner.Id;

        this.saving = true;

        this.projectService
            .addProject(this.addedProject)
            .subscribe(res => {
                this.saving = false;
                this.close();
                this.messageService.addProjectToList(res);
            });
    }

    private validate() {
        var errors: any[] = [];
        if (!(this.client || this.clientName.length > 0)) {
            errors.push('Client must be selected or added.');
        }
        if (!this.projectManager) {
            errors.push('Project Manager must be selected or added.');
        }
        if (!this.addedProject.ProjectName.trim()) {
            errors.push('Project Name must be specified.');
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
        private projectService: ProjectService) {

        this.clientSource = this.optionService.setSource(CONFIG.urls.customer);
        this.clientListFormatter = this.optionService.setListFormatter();

        this.projectManagerSource = this.optionService.setSource(CONFIG.urls.manager);
        this.projectManagerListFormatter = this.optionService.setListFormatter();

        this.opportunityOwnerSource = this.optionService.setSource(CONFIG.urls.manager);
        this.opportunityOwnerListFormatter = this.optionService.setListFormatter();

        this.addedProject = new AddProject({
            ProjectName: '',
            CustomerId: 0,
            CustomerName: '',
            Description: '',
            OpportunityOwnerId: 0,
            ProjectManagerId: 0,
            StartDate: this.dateService.format(new Date()),
            EndDate: this.dateService.format(new Date())
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}