import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core';
import { AdalService } from '../core';

@Component({
    moduleId: module.id,
    selector: 'resource-planner-nav',
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css'],
})
export class NavComponent implements OnInit {

    modal = false;
    
    addAssigmentAllowed: boolean = true;

    constructor(
        private adalService: AdalService,
        private messageService: MessageService) {

        this.adalService.init(
            {
                redirectUri: window.location.origin + '/',
                postLogoutRedirectUri: window.location.origin + '/',
                tenant: 'bluemetal.com',
                clientId: '55324854-cfd5-4d16-bf63-556abddbdf83',  //for localhost testing
                //clientId: 'e36e4a47-114e-41a6-abb0-160b8ead8098',
            });

        this.messageService.onModalToggled(on => {
            if (on) {
                this.modelOnCount++
            } else {
                this.modelOnCount--;
                if (this.modelOnCount < 0) {
                    this.modelOnCount = 0;
                }
            } 
            this.modal = this.modelOnCount > 0;
        });
    }

    private modelOnCount = 0;

    toggleFilters() {
        this.messageService.filterPanelToggle();
    }

    export() {
        this.messageService.filteredRequest("export");
    }

    addAssignment() {
        this.messageService.addAssignmentRequest(true);
    }

    requestResource() {
        this.messageService.resourceRequestRequest(true);
    }

    editColumns() {
        this.messageService.editColumnRequest(true);
    }

    ngOnInit() {
    }
}