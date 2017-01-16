import { AgGridNg2 } from 'ag-grid-ng2/main';
import { GridOptions } from 'ag-grid/main';

/// <reference path="ag-grid/main.d.ts" />

class ColContext {
    type: string;
    index: number;
}

class ColDef {
    context: ColContext = { type: "resourceColumn", index: 0 };
    headerName: string; 
    field: string; 
    width: number; 
    suppressMenu: boolean = true; 
    suppressSorting: boolean = false;
    pinned: string = 'left';
    cellRenderer: (x: any) => string;
}

export class Grid {
    name: string;
    debug: boolean = true;
    enableServerSideSorting: boolean = true;
    enableServerSideFilter: boolean = true;
    enableColResize: boolean = true;
    rowSelection: string = 'single';
    rowDeselection: boolean = true;
    rowModelType: string = 'virtual';
    paginationPageSize: number = 30;
    paginationOverflowSize: number = 2;
    maxConcurrentDatasourceRequests: number = 2;
    paginationInitialRowCount: number = 1;
    maxPagesInCache: number = 6;

    currentDate: Date;
    currentAggregation: string;
    pageSize: number;

    gridOptions:GridOptions;

    rowData: any[];
    columnDefs: ColDef[];

    public constructor(
        fields?: {
            name?: string,
        }) {
        if (fields) Object.assign(this, fields);
        this.gridOptions = <GridOptions>{};
    }

    refresh() {
    }

}
