import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CONFIG, MessageService, DateService } from '../../core';
import { TimeDataPage, TimeAggregation } from '../../models';

@Component({
    moduleId: module.id,
    selector: 'timespan-grid',
    templateUrl: 'timespanGrid.component.html',
    styleUrls: ['timespanGrid.component.css'],
    inputs: [
        'applyTrigger',
        'periodScrollTrigger',
        'queryConfig',
        'gridConfig'],
    styles: ['.toolbar button {margin: 2px; padding: 0px;}'],
})
export class TimespanGridComponent implements OnDestroy, OnInit {

    ready: boolean = false;

    gridConfig: any;

    queryConfig: any;

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

    @Output() dataRequested: EventEmitter<any>;
    @Output() rowSelected: EventEmitter<any>;
    @Output() periodScrolled: EventEmitter<any>;

    rowData: any[];
    columnDefs: any[];
    rowCount: string;

    constructor(
        private messageService: MessageService,
        private dateService: DateService) {

        this.dataRequested = new EventEmitter<any>();
        this.rowSelected = new EventEmitter<any>();
        this.periodScrolled = new EventEmitter<any>();
    }

    ngOnInit() {

        this.trimColumns(this.gridConfig.columns);

        this.columnDefs = this.createColumnDefs();

        this.gridOptions = <GridOptions>{
            debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: 'single',
            rowDeselection: true,
            rowModelType: 'virtual',
            paginationPageSize: 300,
            paginationOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            paginationInitialRowCount: 1,
            maxPagesInCache: 6,
            getRowNodeId: item => item.Id,
        };  // we pass gridOptions in, so we can grab the api out

        this.resetCurrentDate();
    }

    private resetCurrentDate() {
        this.currentDate = new Date();
        this.currentDate.setHours(0);
        this.currentDate.setMinutes(0);
        this.currentDate.setSeconds(0);
    }

    private gridClicked($event: any) {
        var srcHtml = $event.srcElement.outerHTML;
        if (srcHtml.indexOf('timePeriodBackwardButton') >= 0) {
            this.periodScrolled.emit(-1);
            this.periodScroll(-1)
        }
        if (srcHtml.indexOf('timePeriodForwardButton') >= 0) {
            this.periodScrolled.emit(1);
            this.periodScroll(1)
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
        row[timePeriod + "ForecastHours"] = assignment.ForecastHours;
        row[timePeriod + "ActualHours"] = assignment.ActualHours;
        row[timePeriod + "DeltaHours"] = assignment.ResourceHours - assignment.ForecastHours;
    }

    private addAssignments(row: any, assignments: any[]) {
        for (var i = 0; i < assignments.length; i++) {
            this.addAssignment(row, assignments[i], i);
        }
    }

    private createDateColumn(fieldNameRoot: string, fieldNameSuffix: string, index: number) {
        return {
            headerName: CONFIG.dataHeaders[index],
            width: 45,
            context: { type: "dataColumn", index: 0 },
            field: fieldNameRoot + "-" + fieldNameSuffix,
            suppressSorting: true,
            suppressMenu: true,
            cellRenderer: timePeriodCellRenderer,
        };

        function timePeriodCellRenderer(params: any) {
            if (params.data !== undefined) {
                var floatValue = parseFloat(params.value);
                if (!isNaN(floatValue) && floatValue != null) {
                    var colName = params.column.colId;
                    var value = floatValue.toFixed(0);
                    if (colName.includes('Delta')) {
                        if (floatValue > 0) {
                            return "<img src='Images/IRMT_Icons_GreenUpArrow.png'/> " + value;
                        }
                        if (floatValue < 0) {
                            return "<img src='Images/IRMT_Icons_RedDownArrow.png'/> " + value;
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
            if (periodIndex == 0 && !this.gridConfig.hideTimePeriodScroll) {
                header = '<a id="timePeriodBackwardButton" style="float: left;"><img src="/Images/IRMT_Icons_BackAWeek.png" /></a>';
            }
            header += timePeriods[periodIndex];
            if (++periodIndex == this.periodColumnsCount && !this.gridConfig.hideTimePeriodScroll ) {
                header += '<a id="timePeriodForwardButton" style="float: right;"><img src="/Images/IRMT_Icons_ForwardAWeek.png" /></a>';
            }
        }
        return {
            suppressMenu: true,
            headerName: header,
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
        var numCols = 8;
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

    private currentDate: Date;
    private periodColumnsCount: number = CONFIG.periodColumnsCount;

    private getDateQuery(): string {
        var start = `&startDate=${this.dateService.format(this.dateService.getStart(this.currentDate, this.queryConfig.aggregation, this.periodColumnsCount))}`;
        var end = `&endDate=${this.dateService.format(this.dateService.getEnd(this.currentDate, this.queryConfig.aggregation, this.periodColumnsCount))}`;
        return start + end;
    }

    private getSortQuery(params: any): string {
        if (params.sortModel.length > 0) {
            return `&sortOrder=${params.sortModel[0].colId}&sortDirection=${params.sortModel[0].sort}`;
        }
        return '';
    }

    private periodScroll(step: number) {
        this.currentDate = this.dateService.update(this.currentDate, this.queryConfig.aggregation, this.periodColumnsCount, step);
        this.refresh();
    }

    private buildQuery(params: any) {
        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        var pageSize = params.endRow - params.startRow;
        var pageNum = params.startRow / pageSize;

        return `?pageSize=${pageSize}&pageNum=${pageNum}${this.getDateQuery()}${this.getSortQuery(params)}&${this.queryConfig.query}`;
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
                    if (page.TimePeriods) {
                        this.gridOptions.api.setColumnDefs(this.createColumnDefs(page.TimePeriods));
                    }
                    params.successCallback(rows, page.TotalRowCount);
                    api.refreshHeader();
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
        //console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
        //clickedColumnName = $event.colDef.field;
    }

    private onRowSelected($event: any) {
       console.log('onRowSelected');
       if ($event.node.isSelected()) {
            this.rowSelected.emit({
                rowData: $event.node.data,
            });
      }
    }

    private onCellValueChanged($event: any) {
        //console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
    }

    private onCellDoubleClicked($event: any) {
        //console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellContextMenu($event: any) {
        //console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
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