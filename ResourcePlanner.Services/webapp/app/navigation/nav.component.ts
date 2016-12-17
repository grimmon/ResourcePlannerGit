import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core';

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
        private messageService: MessageService) {

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

    ngOnInit() {
    }
}