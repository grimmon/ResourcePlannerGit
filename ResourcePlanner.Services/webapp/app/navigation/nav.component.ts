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

    conextmenu(event: any) {
        event.preventDefault();
        this.adalService.logout();
    }

    exporting: boolean = false;

    constructor(
        private adalService: AdalService,
        private messageService: MessageService) {

        this.adalService.init(
            {
                redirectUri: window.location.origin + '/',
                postLogoutRedirectUri: window.location.origin + '/',
                tenant: 'bluemetal.com',
                //clientId: 'a11dd272-7135-4d32-a588-e3604403a94c'   //for DEV
                clientId: '5fb0ef9e-745a-4d68-8c16-14fd60d6eaae'     //for UAT
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
        this.exporting = true;
        this.messageService.filteredRequest({
            type: "export",
            callback: () => { this.exporting = false; },
        });
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