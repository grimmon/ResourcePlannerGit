import { Component, OnDestroy, OnInit } from '@angular/core';

import { CONFIG, MessageService } from '../../core';
import { ResourceService } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'resource-removal-confirmation-dialog',
    templateUrl: 'resourceRemovalConfirmationDialog.component.html',
    styleUrls: ['resourceRemovalConfirmationDialog.component.css'],
    inputs: ['assignmentInfoForRemoval']
})
export class ResourceRemovalConfirmationDialogComponent implements OnDestroy, OnInit {

    set assignmentInfoForRemoval(v: any) {
        if (this._assignmentInfoForRemoval = v) {
            this.messageService.modalToggle(this.visible = true);
        }
    }
    get assignmentInfoForRemoval() {
        return this._assignmentInfoForRemoval;
    }
    _assignmentInfoForRemoval: any;


    visible: boolean = false;

    constructor(
        private resourceService: ResourceService,
        private messageService: MessageService) {
    }

    ngOnInit() {

    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    save() {
        console.log(this._assignmentInfoForRemoval);
        this.notify();
        this.resourceService
            .deleteAssignment(this._assignmentInfoForRemoval)
            .subscribe(res => {
                this.notify();
                this.close();
            });
    }

    notify() {
        this.messageService.timespanGridRefreshRequest('resource-list');

    }
    ngOnDestroy() {
    }
}