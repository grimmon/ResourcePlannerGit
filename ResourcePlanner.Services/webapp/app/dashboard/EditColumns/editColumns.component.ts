import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MessageService, EntityService } from '../../core';
import { ColumnOption, Option, OptionService } from '../../models';
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

            this.resourcePageColumnOptions = this.copy(this.optionService.resourcePageColumnOptions); 
            this.detailPageColumnOptions = this.copy(this.optionService.detailPageColumnOptions); 
        }
    }
    _showTrigger = 0;

    visible: boolean = false;

    saving: boolean = false;

    applyTrigger = 1;

    resourcePageColumnOptions: ColumnOption[];
    detailPageColumnOptions: ColumnOption[];

    constructor(
        private messageService: MessageService,
        private optionService: OptionService,
        private entityService: EntityService) {

        this.columnsEdited = new EventEmitter<any>();
    }

    ngOnInit() {
    }

    copy(source: ColumnOption[]): ColumnOption[] {
        return source.map(option => {
            return this.entityService.clone(option);
        });
    }

    save() {
        this.optionService.resourcePageColumnOptions = this.copy(this.resourcePageColumnOptions);
        this.optionService.detailPageColumnOptions = this.copy(this.detailPageColumnOptions); 
        this.optionService.saveAllColumnOptions();

        this.messageService.timespanGridRefreshRequest('resource-list');
        this.close();
    }

    close() {
        this.messageService.modalToggle(this.visible = false);
    }

    ngOnDestroy() {
    }
}