import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-ng2/main';

import { ExceptionService } from './exception.service';
import { MessageService } from './message.service';
import { EntityService } from './entity.service';
import { ServerService } from './server.service';
import { DateService } from './date.service';

import { SpinnerModule } from './spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AgGridModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SpinnerModule,
    ],
    declarations: [
    ],
    providers: [
        MessageService,
        ExceptionService,
        ServerService,
        DateService,
        EntityService,
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    }
}