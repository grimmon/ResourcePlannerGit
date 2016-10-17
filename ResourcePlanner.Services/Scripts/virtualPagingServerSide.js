document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < grids.length; i++) {
        var gridDiv = document.querySelector(grids[i].name);
        new agGrid.Grid(gridDiv, grids[i].options);

        grids[i].options.context = grids[i].name;

        var dataSource =  {
            rowCount: null, // behave as infinite scroll
            getRows: getData
        };

        grids[i].options.api.setDatasource(dataSource);
    }
});

function getData(params) {
    var grid = getGrid(params.context);

    var query = buildQuery(params);
    callServer(params, query, grid.options, grid.createRow, grid.createColumn);
}

function getGrid(gridName) {
    for (var i = 0; i < grids.length; i++) {
        if (grids[i].name == gridName) {
            return grids[i];
        }
    }
}

function callServer(params, query, options, populateRow, createColumns) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', query);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            httpResponse = JSON.parse(httpRequest.responseText);
            updateGrid(params, httpResponse, options, populateRow, createColumns);
        }
    };
}

function updateGrid(params, resourcePage, options, populateRow, createColumns) {
    var columns = createColumns(resourcePage);
    var rows = createRows(resourcePage.Resources, resourcePage.TimePeriods, populateRow);

    options.api.setColumnDefs(columns);

    params.successCallback(rows, resourcePage.TotalResourceCount);
}

function createRows(rowData, columnData, rowParser) {
    var rows = [rowData.length];

    for (var i = 0; i < rowData.length; i++) {
        var resource = rowData[i];
        var row = createRow(resource, columnData, rowParser);

        rows[i] = row;
    }

    return rows;
}

function createRow(rowData, columns, rowParser) {
    var row = {};

    rowParser(row, rowData, columns);

    return row;
}

var timePeriodCellRenderer = function (params) {
    if (params.data !== undefined) {
        var floatValue = parseFloat(params.value);

        if (isNaN(floatValue) || floatValue == null) {
            return '';
        }

        return floatValue.toFixed(2);
    }
    else {
        return '';
    }
};

var startingColumnDefs = [
    {
        headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true,
        cellRenderer: function (params) {
            if (params.data !== undefined) {
                return params.value;
            } else {
                return '<img src="../images/loading.gif">'
            }
        },
    },
    { headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: { newRowsAction: 'keep' } },
    { headerName: "Position", field: "Position", width: 150, filter: 'set', filterParams: { newRowsAction: 'keep' } },
    { headerName: "City", field: "City", width: 150, suppressMenu: true },
];

function createResourceColumns(resourcePage) {
    var newColumns = [startingColumnDefs.length + resourcePage.TimePeriods.length];

    //add initial colummns, defined in startingColumnDefs
    for (var i = 0; i < startingColumnDefs.length; i++) {
        var column = startingColumnDefs[i];

        newColumns[i] = column;
    }

    //add time periods as columns
    for (i = 0; i < resourcePage.TimePeriods.length; i++) {
        var timePeriod = resourcePage.TimePeriods[i];
        column = createColumn(timePeriod);

        var newColumnIndex = i + startingColumnDefs.length;
        newColumns[newColumnIndex] = column;
    }

    return newColumns;
}

var grids = [
    {
        name: '#myGrid',
        createRow: createResourceRow,
        createColumn: createResourceColumns,
        options: {
            debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: 'single',
            rowDeselection: true,
            columnDefs: startingColumnDefs,
            rowModelType: 'virtual',
            paginationPageSize: 30,
            paginationOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            paginationInitialRowCount: 1,
            maxPagesInCache: 6,
            onRowSelected: rowSelectedFunc,
            getRowNodeId: function (item) {
                return item.Id;
            }
        },
        queryBuilder: buildQuery
    },
    {
        name: '#myGrid2',
        createRow: createResourceRow,
        createColumn: createResourceColumns,
        options: {
            debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: 'single',
            rowDeselection: true,
            columnDefs: startingColumnDefs,
            rowModelType: 'virtual',
            paginationPageSize: 30,
            paginationOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            paginationInitialRowCount: 1,
            maxPagesInCache: 6,
            getRowNodeId: function (item) {
                return item.Id;
            }
        },
        hide: true,
        queryBuilder: buildQuery
    }
];

function buildQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSizeParam = 'pageSize=' + pageSize;
    var pageNumParam = 'pageNum=' + pageNum;
    var sortOrderParam = 'sort=' + params.sortModel.colId;
    var aggParam = "agg=";
    var sortDirectionParam = "sortDirection=";
    var cityParam = "city=";
    var marketParam = "market=";
    var regionParam = "regiion=";
    var orgUnitParam = "orgUnit=";
    var practiceParam = "practice=";
    var positionParam = "position=";
    var StartDateParam = "startDate=";
    var EndDateParam = "enddate=";

    filters += pageSizeParam + '&' + pageNumParam;

    var query = 'http://localhost:1620/api/resource' + filters;

    return query;
}

function createColumn(timePeriod) {
    return {
        headerName: timePeriod,
        suppressMenu: true,
        children: [
            { headerName: "Actual Hours", width: 120, field: timePeriod + "ActualHours", cellRenderer: timePeriodCellRenderer },
            { headerName: "Forecast Hours", width: 140, field: timePeriod + "ForecastHours", cellRenderer: timePeriodCellRenderer }
        ]
    };
}

function createResourceRow(row, resource, timePeriods) {

    row.FirstName = resource.FirstName;
    row.LastName = resource.LastName;
    row.City = resource.City;
    row.Position = resource.Position;
    row.Id = resource.Id;

    for (var i = 0; i < timePeriods.length; i++) {
        var timePeriod = timePeriods[i];

        row[timePeriod] = '';
    }

    for (i = 0; i < resource.Assignments.length; i++) {
        var assignment = resource.Assignments[i];
        timePeriod = assignment.TimePeriod;

        var actualHoursIndex = timePeriod + "ActualHours";
        var forecastHoursIndex = timePeriod + "ForecastHours";

        row[actualHoursIndex] = assignment.ActualHours;
        row[forecastHoursIndex] = assignment.ForecastHours;
    }
}

function rowSelectedFunc(event) {
    $("#myGrid2").hide();
}