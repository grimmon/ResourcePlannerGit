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
    }

    toggleFilters() {
        this.messageService.filterPanelToggle();
    }

    export() {
        this.messageService.filteredRequest("export");
    }

    logout() {
        //this.adalService.logOut();
    }

    getUserInfo() {
        //return this.adalService.userInfo;
    }

}