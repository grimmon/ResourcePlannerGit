import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CONFIG, MessageService, DateService } from '../../core';
import { TimeDataPage, TimeAggregation, AddAssignments, UpdateAssignment, OptionService } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'timespan-grid',
    templateUrl: 'timespanGrid.component.html',
    styleUrls: ['timespanGrid.component.css'],
    inputs: [
        'applyTrigger',
        'periodScrollTrigger',
        'queryConfig',
        'currentDate',
        'gridConfig'],
    styles: ['.toolbar button {margin: 2px; padding: 0px;}'],
})
export class TimespanGridComponent implements OnDestroy, OnInit {

    @Output() dataRequested: EventEmitter<any>;
    @Output() rowSelected: EventEmitter<any>;
    @Output() periodScrolled: EventEmitter<any>;
    @Output() refreshed: EventEmitter<any>;
    @Output() dataCellEditorRequested: EventEmitter<any>;
    @Output() dataCellEditRequested: EventEmitter<any>;

    ready: boolean = false;

    gridConfig: any;

    queryConfig: any;

    _currentDate: string;
    set currentDate(v: string) {
        this.queryConfig.currentDate = this.dateService.getDate(v);
        this.resetCurrentDate();
    }
    _applyTrigger: number;
    set applyTrigger(v: number) {
        this._applyTrigger = v;
        if (this.ready) {
            this.resetCurrentDate();
            this.refresh();
        }
    }

    _periodScrollTrigger: any;
    set periodScrollTrigger(v: any) {
        this._periodScrollTrigger = v;
        if (this.ready) {
            this.periodScroll(this._periodScrollTrigger.step);
        }
    }

    rowData: any[];
    columnDefs: any[];
    rowCount: string;

    constructor(
        private messageService: MessageService,
        private dateService: DateService,
        private optionService: OptionService) {

        this.dataRequested = new EventEmitter<any>();
        this.rowSelected = new EventEmitter<any>();
        this.periodScrolled = new EventEmitter<any>();
        this.refreshed = new EventEmitter<any>();
        this.dataCellEditorRequested = new EventEmitter<any>();
        this.dataCellEditRequested = new EventEmitter<any>();
    }

    ngOnInit() {

        if (this.gridConfig.refreshContexts) {
            this.messageService.onTimespanGridRefreshRequested(gridContext => {
                if (this.gridConfig.refreshContexts.indexOf(gridContext) >=0 ) {
                    this.refresh();
                }
            });
        }

        this.trimColumns(this.gridConfig.columns);

        this.columnDefs = this.createColumnDefs();

        this.gridOptions = <GridOptions>{
            //debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: this.gridConfig.rowSelection || 'single',
            rowDeselection: true,
            rowModelType: 'virtual',
            paginationPageSize: 300,
            paginationOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            paginationInitialRowCount: 1,
            singleClickEdit: true,
            maxPagesInCache: 6,
            getRowNodeId: item => item.Id,
        };  // we pass gridOptions in, so we can grab the api out

        this.resetCurrentDate();

        this.periodScrolled.emit({
            direction: 0,
            query: this.getDateQuery(),
            newDate: this.queryConfig.currentDate
        });
    }

    private resetCurrentDate() {
        if (!this.queryConfig.currentDate) {
            this.queryConfig.currentDate = new Date();
        }
        this.queryConfig.currentDate.setHours(0);
        this.queryConfig.currentDate.setMinutes(0);
        this.queryConfig.currentDate.setSeconds(0);
    }

    private gridClicked($event: any) {
        var srcHtml = $event.srcElement.outerHTML;
        if (srcHtml.indexOf('timePeriodBackwardButton') >= 0) {
            this.periodScroll(-1)
            this.periodScrolled.emit({
                direction: -1,
                query: this.getDateQuery(),
                newDate: this.queryConfig.currentDate
            });
        }
        if (srcHtml.indexOf('timePeriodForwardButton') >= 0) {
            this.periodScroll(1)
            this.periodScrolled.emit({
                direction: 1,
                query: this.getDateQuery(),
                newDate: this.queryConfig.currentDate
            });
        }
    }

    private gridOptions: GridOptions;

    private createRowData(page: TimeDataPage) {
        var items: any[] = page.TotalRowCount ? this.gridConfig.getItems(page) : [];
        return items.map(item => {
            var row = new this.gridConfig.createRow(item);
            this.addAssignments(row, item.Assignments);
            return row;
        });
    }

    private addAssignment(row: any, assignment: any, timePeriod: any) {
        timePeriod += "-";
        row[timePeriod + "ResourceHours"] = assignment.ResourceHours;
        row[timePeriod + "ResourceHoursSoft"] = assignment.SoftResourceHours;
        row[timePeriod + "ForecastHours"] = assignment.ForecastHours;
        row[timePeriod + "ActualHours"] = assignment.ActualHours;
        row[timePeriod + "DeltaHours"] = assignment.ForecastHours - assignment.ResourceHours;
    }

    private addAssignments(row: any, assignments: any[]) {
        for (var i = 0; i < assignments.length; i++) {
            this.addAssignment(row, assignments[i], i);
        }
    }

    private createDateColumn(fieldNameRoot: string, fieldNameSuffix: string, index: number) {
        var colDef: any = {
            headerName: CONFIG.dataHeaders[index],
            width: 45,
            context: { type: "dataColumn", index: index },
            field: fieldNameRoot + "-" + fieldNameSuffix,
            suppressSorting: true,
            suppressMenu: true,
            cellRenderer: timePeriodCellRenderer,
            editable: false
        };

        return colDef;


        function timePeriodCellRenderer(params: any) {
            if (params.data !== undefined) {
                var floatValue = parseFloat(params.value);
                if (!isNaN(floatValue) && floatValue != null) {
                    var colName = params.column.colId;
                    var value = floatValue == 0 ? "-" : floatValue.toFixed(0);
                    if (colName.includes('Delta')) {
                        if (floatValue > 0) {
                            return "<img src='Images/IRMT_Icons_GreenUpArrow.png'/> " + value;
                        }
                        if (floatValue < 0) {
                            return "<img src='Images/IRMT_Icons_RedDownArrow.png'/> " + value;
                        }
                    }
                    if (colName.includes('Resource')) {
                        var softCol = colName + "Soft";
                        var softColVal = parseFloat(params.data[softCol]);
                        if (softColVal > 0) {
                            value = '<div style="background-color:lightgrey;">' + value + '</div>';
                        }
                    }
                    return value;
                }
            }
            return '';
        }
    }

    private createDatesColumn(fieldName: any, groupType: string, timePeriods?: string[]) {
        var header = "";
        if (timePeriods) {
            var periodIndex: number = fieldName;
            if (periodIndex == 0 && this.gridConfig.showTimePeriodScroll) {
                header = '<a id="timePeriodBackwardButton" style="float: left;"><img src="/Images/IRMT_Icons_BackAWeek.png" /></a>';
            }
            header += timePeriods[periodIndex];
            if (++periodIndex == this.periodColumnsCount && this.gridConfig.showTimePeriodScroll ) {
                header += '<a id="timePeriodForwardButton" style="float: right;"><img src="/Images/IRMT_Icons_ForwardAWeek.png" /></a>';
            }
        }
        return {
            suppressMenu: true,
            headerName: header,
            marryChildren: true,
            context: { type: groupType, index: fieldName },
            children: [
                this.createDateColumn(fieldName, "ResourceHours", 0),
                this.createDateColumn(fieldName, "ForecastHours", 1),
                this.createDateColumn(fieldName, "ActualHours", 2),
                this.createDateColumn(fieldName, "DeltaHours", 3),
            ]
        }
    }

    private createColumnDefs(timePeriods?: string[]): any[] {
        var numCols = timePeriods ? timePeriods.length : this.periodColumnsCount;
        var datesColumns: any[] = [];
        for (var i = 0; i < numCols; i++) {
            datesColumns.push(this.createDatesColumn(i, "resourceGroupColumn", timePeriods));
        }
        return this.gridConfig.columns.concat(datesColumns);
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            var model = this.gridOptions.api.getModel();
            var totalRows = this.rowData.length;
            var processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    private clickedFirstColumn = false;

    private periodColumnsCount: number = CONFIG.periodColumnsCount;

    private getDateQuery(): string {
        var start = this.queryConfig.startDate = this.dateService.getStart(this.queryConfig.currentDate, this.queryConfig.aggregation, this.periodColumnsCount),
            startFormatted = this.dateService.format(start),
            end = this.queryConfig.endDate = this.dateService.getEnd(this.queryConfig.currentDate, this.queryConfig.aggregation, this.periodColumnsCount),
            endFormatted = this.dateService.format(end);
        return `&startDate=${startFormatted}&endDate=${endFormatted}`;
    }

    private getSortQuery(params: any): string {
        if (params.sortModel.length > 0) {
            return `&sortOrder=${params.sortModel[0].colId}&sortDirection=${params.sortModel[0].sort}`;
        }
        return '';
    }

    private periodScroll(step: number) {
        this.queryConfig.currentDate = this.dateService.update(this.queryConfig.currentDate, this.queryConfig.aggregation, this.periodColumnsCount, step);
        this.refresh();
    }

    private buildQuery(params: any) {
        var pageSize = params.endRow - params.startRow;
        var pageNum = params.startRow / pageSize;
        return `?pageSize=${pageSize}&pageNum=${pageNum}${this.getDateQuery()}${this.getSortQuery(params)}${this.queryConfig.query ? '&' + this.queryConfig.query : ''}`;
    }

    private hideColumns() {
        var myService = this.optionService;
        this.gridConfig.columns.forEach(function (element: any) {
            if (element.context.type == 'resourceColumn') {
                element.hide = myService.getResourceColumnOptionByField(element.field) || false;
            }
            if (element.context.type == 'resourceDetailColumn') {
                element.hide = myService.getDetailColumnOptionByField(element.field) || false;
            }
        });
    }

    private refresh() {
        var api = this.gridOptions.api;
        api.showLoadingOverlay();
        api.setDatasource({
            rowCount: null, // behave as infinite scroll
            getRows: (params: any) => {
                var request = {
                    query: this.buildQuery(params),
                    dataObservable: {}
                }
                this.dataRequested.emit(request);
                (<Observable<any>>request.dataObservable).subscribe((page: TimeDataPage) => {
                    api.hideOverlay();
                    var rows = this.createRowData(page);
                    this.hideColumns();
                    if (page.TimePeriods) {
                        this.gridOptions.api.setColumnDefs(this.createColumnDefs(page.TimePeriods));
                    }
                    params.successCallback(rows, page.TotalRowCount);
                    api.refreshHeader();
                    this.refreshed.emit(page);
                });
            }
        });
    }

    private trimColumns(columns: any[]) {
        columns.forEach(column => {
            if (column.context && column.context.index == 0) {
                column.cellRenderer = (params: any) => {
                    return params.data !== undefined ? params.value : '<img src="Images/loading.gif">';
                };
            }
        });
    }


    private onModelUpdated() {
        //console.log('onModelUpdated' + this.gridOptions.api);
        this.calculateRowCount();
    }

    private onReady() {
        this.ready = true;
        this.calculateRowCount();
    }

    private onCellClicked($event: any) {
        var context = $event.colDef.context,
            firstColumn = context.index == 0,
            dataColumn = context.type == 'dataColumn';
        this.clickedFirstColumn = firstColumn && !dataColumn;
        if (this.gridConfig.allowDataEdit && firstColumn && dataColumn && this.queryConfig.aggregation == TimeAggregation.Weekly) {
            $event.colDef.editable = true;
            $event.colDef.cellEditor = 'text';
        }
        if (this.gridConfig.context == 'resource-list' && firstColumn && dataColumn && this.queryConfig.aggregation == TimeAggregation.Weekly) {
            //var templateWithTooltip = '<div><a tooltip="What am I doing wrong with the tooltip?" tooltip-append-to-body="true" tooltip-placement="right" >' + 'saggin dags' + '</a></div>';
            //$event.data[$event.colDef.field] = templateWithTooltip;
        }
       
    }

    private onRowSelected($event: any) {
        var selectedNodes = this.gridOptions.api.getSelectedNodes();
        this.gridConfig.selectedIds = selectedNodes.map(node => node.id);
    }

    private onRowClicked($event: any) {
        if (this.clickedFirstColumn) {
            this.rowSelected.emit({
                rowData: $event.node.data,
            });
        }
    }

    private onCellValueChanged($event: any) {
        var numbers = new RegExp(/^[0-9]+$/);
        if (numbers.test($event.newValue)) {
            var newVal = +$event.newValue;
            if (newVal == $event.oldValue) {
                //no save needed
            } 
            else if (newVal >= 0 && newVal <= 168) {
                var field = $event.colDef.field,
                    periodIndex = parseInt(field.substr(0, field.indexOf('-'), 10)),
                    periodStart = this.dateService.moveDate(this.queryConfig.startDate, TimeAggregation.Weekly, periodIndex),
                    periodEnd = this.dateService.moveDate(periodStart, TimeAggregation.Daily, 6);
                this.gridConfig.saveEditedCell({
                    context: this.gridConfig.context,
                    assignment: new UpdateAssignment({
                        resourceId: 0,
                        projectMasterId: $event.data.Id,
                        hoursPerWeek: newVal,
                        startDate: this.dateService.format(periodStart),
                        endDate: this.dateService.format(periodEnd)

                    })
                });
            }
            else {
                $event.data[$event.colDef.field] = $event.oldValue;
            }
        }
        else {
            $event.data[$event.colDef.field] = $event.oldValue;
        }
    }

    private onCellDoubleClicked($event: any) {
        this.gridOptions.api.stopEditing();
        var context = $event.colDef.context,
            firstColumn = context.index == 0,
            dataColumn = context.type == 'dataColumn';
        this.clickedFirstColumn = firstColumn && !dataColumn;
        if (this.gridConfig.allowDataEdit && firstColumn && dataColumn && this.queryConfig.aggregation == TimeAggregation.Weekly) {
            // activate editor
            var field = $event.colDef.field,
                periodIndex = parseInt(field.substr(0, field.indexOf('-'), 10)),
                periodStart = this.dateService.moveDate(this.queryConfig.startDate, TimeAggregation.Weekly, periodIndex),
                periodEnd = this.dateService.moveDate(periodStart, TimeAggregation.Daily, 6);
            this.dataCellEditorRequested.emit({
                context: this.gridConfig.context,
                assignment: new UpdateAssignment({
                    resourceId: 0,
                    projectMasterId: $event.data.Id,
                    hoursPerDay: CONFIG.defaultHoursPerDay,
                    startDate: this.dateService.format(periodStart),
                    endDate: this.dateService.format(periodEnd),
                    daysOfWeek: CONFIG.defaultDaysOfWeek,
                })
            });
        }
    }

    private onCellContextMenu($event: any) {
        $event.event.preventDefault();
        if (this.gridConfig.handleContext) {
            this.gridConfig.handleContext($event);
        }
    }

    private onCellFocused($event: any) {
        //console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    private onSelectionChanged() {
        //console.log('selectionChanged');
    }

    private onBeforeFilterChanged() {
        //console.log('beforeFilterChanged');
    }

    private onAfterFilterChanged() {
        //console.log('afterFilterChanged');
    }

    private onFilterModified() {
        //console.log('onFilterModified');
    }

    private onBeforeSortChanged() {
        //console.log('onBeforeSortChanged');
    }

    private onAfterSortChanged() {
        //console.log('onAfterSortChanged');
    }

    private onVirtualRowRemoved($event: any) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    public onQuickFilterChanged($event: any) {
        //this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event: any) {
        //console.log('onColumnEvent: ' + $event);
    }

    ngOnDestroy() {
    }
}