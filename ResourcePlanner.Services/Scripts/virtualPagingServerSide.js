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
    {headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: { newRowsAction: 'keep' } },
    {headerName: "Position" , field: "Position", width: 150, filter: 'set'   , filterParams: { newRowsAction: 'keep' } },
    {headerName: "City"     , field: "City"    , width: 150, suppressMenu: true},
];

var gridOptions = {
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
    getRowNodeId: function(item) {
        return item.Id;
    }
};

var timemPeriodCellRenderer = function (params) {
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

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');

    new agGrid.Grid(gridDiv, gridOptions);

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: getRowData
    };

    gridOptions.api.setDatasource(dataSource);
});

function getRowData(params) {
    var query = buildQuery(params);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', query);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResponse = JSON.parse(httpRequest.responseText);
            updateGrid(params, httpResponse);
        }
    };
}

function buildQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSizeParam      = 'pageSize=' + pageSize;
    var pageNumParam       = 'pageNum='  + pageNum;
    var sortOrderParam     = 'sort='     + params.sortModel.colId;
    var aggParam           = "agg=";
    var sortDirectionParam = "sortDirection=";
    var cityParam          = "city=";
    var marketParam        = "market=";
    var regionParam        = "regiion=";
    var orgUnitParam       = "orgUnit=";
    var practiceParam      = "practice=";
    var positionParam      = "position=";
    var StartDateParam     = "startDate=";
    var EndDateParam       = "enddate=";

    filters += pageSizeParam + '&' + pageNumParam;

    var query = 'http://localhost:1620/api/resource' + filters;

    return query;
}

function updateGrid(params, resourcePage) {
    var columns = createColumns(resourcePage);
    var rows = createRows(resourcePage);

    gridOptions.api.setColumnDefs(columns);
    
    params.successCallback(rows, resourcePage.TotalResourceCount);
}

function createColumns(resourcePage) {
    var newColumns = [startingColumnDefs.length];

    //add initial colummns, defined in startingColumnDefs
    for (var i = 0; i < startingColumnDefs.length; i++) {
        var column = startingColumnDefs[i];

        newColumns[i] = column;
    }

    //add time periods as columns
    for (var i = 0; i < resourcePage.TimePeriods.length; i++) {
        var timePeriod = resourcePage.TimePeriods[i];
        var column = createColumn(timePeriod);

        var newColumnIndex = i + startingColumnDefs.length;
        newColumns[newColumnIndex] = column;
    }

    return newColumns;
}

function createColumn(timePeriod) {
    return {
        headerName: timePeriod,
        suppressMenu: true,
        children: [
            {headerName: "Actual Hours"  , width: 120, field: timePeriod + "ActualHours"  , cellRenderer: timemPeriodCellRenderer},
            {headerName: "Forecast Hours", width: 140, field: timePeriod + "ForecastHours", cellRenderer: timemPeriodCellRenderer}
        ]
    };
}

function createRows(resourcePage) {
    var rows = [resourcePage.Resources.length];

    for (var i = 0; i < resourcePage.Resources.length; i++) {
        var resource = resourcePage.Resources[i];
        var row = createRow(resource, resourcePage.TimePeriods);

        rows[i] = row;
    }

    return rows;
}

function createRow(resource, timePeriods) {
    var row = {};

    populateRow(row, resource, timePeriods);

    return row;
}

function populateRow(row, resource, timePeriods) {

    row.FirstName = resource.FirstName;
    row.LastName  = resource.LastName;
    row.City      = resource.City;
    row.Position  = resource.Position;
    row.Id        = resource.Id;

    for (var i = 0; i < timePeriods.length; i++) {
        var timePeriod = timePeriods[i];

        row[timePeriod] = '';
    }

    for (var i = 0; i < resource.Assignments.length; i++) {
        var assignment = resource.Assignments[i];
        var timePeriod = assignment.TimePeriod;

        var actualHoursIndex = timePeriod + "ActualHours";
        var forecastHoursIndex = timePeriod + "ForecastHours";

        row[actualHoursIndex] = assignment.ActualHours;
        row[forecastHoursIndex] = assignment.ForecastHours;
    }
}