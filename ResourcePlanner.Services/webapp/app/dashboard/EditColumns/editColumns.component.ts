import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ExceptionService, MessageService, DateService } from '../../core';
import { OptionType, Option, OptionService, DetailPageColumnOption, ResourcePageColumnOption, ResourcePageColumnType, DetailPageColumnType, ResourcePage, ResourceRow, ResourceService, AddAssignments, TimeAggregation, } from '../../models';
import { CONFIG } from '../../core';

@Component({
    moduleId: module.id,
    selector: 'edit-columns',
    templateUrl: 'editColumns.component.html',
    styleUrls: ['editColumns.component.css'],
    inputs: [
        'showTrigger'
    ]
})
export class EditColumnsComponent implements OnDestroy, OnInit {

    @Output() columnsEdited: EventEmitter<any>;

    set showTrigger(v: any) {
        this._showTrigger = v;
        if (this._showTrigger) {
            this.messageService.modalToggle(this.visible = true);
            this.saving = false;
            this.applyTrigger++;
        }
    }
    _showTrigger = 0;

    visible: boolean = false;

    saving: boolean = false;

    applyTrigger = 1;

    resourcePageColumns: string[] = ['Resource Name', 'Position', 'City', 'Practice', 'Sub-practice', 'Resource Mgr'];
    detailPageColumns: string[] = ['Project Name', 'Project Number', 'WBS Element', 'Client', 'Opportunity Owner', 'Project Manager', 'Description'];

    resourcePageColumnOption: any[];
    detailPageColumnOption: any[];

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private dateService: DateService,
        private exceptionService: ExceptionService ) {

        this.columnsEdited = new EventEmitter<any>();
    }

    ngOnInit() {
    }

    close() {
        //this.messageService.timespanGridRefreshRequest('resource-list');
        this.messageService.modalToggle(this.visible = false);
    }


    ngOnDestroy() {
    }
}