import { Component, OnInit } from '@angular/core';
//import { AdalService } from 'angular2-adal/core';
import { MessageService } from '../core';

class MenuItem {
  constructor(public caption: string, public link: any[]) { }
}

@Component({
    moduleId: module.id,
    selector: 'resource-planner-nav',
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css'],
})
export class NavComponent implements OnInit {
    menuItems: MenuItem[];

    modal = false;
    
    addAssigmentAllowed: boolean = true;

    ngOnInit() {
        this.menuItems = [
            { caption: 'Dashboard', link: ['/dashboard'] },
            { caption: 'Assignments', link: ['/assignments'] },
            { caption: 'Admin', link: ['/admin'] },
            { caption: 'Login', link: ['/login'] },
        ];
    }

    constructor(
        //private adalService: AdalService,
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

    logout() {
        //this.adalService.logOut();
    }

    getUserInfo() {
        //return this.adalService.userInfo;
    }
}