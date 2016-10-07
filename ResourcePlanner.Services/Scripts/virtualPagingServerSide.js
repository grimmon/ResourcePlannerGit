var startingColumnDefs = [
    {
        headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true,
        cellRenderer: function (params) {
            if (params.data !== undefined) {
                return params.node.id;
            } else {
                return '<img src="../images/loading.gif">'
            }
        },
    },
    {headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: {newRowsAction: 'keep'}},
    {headerName: "Position", field: "Position", width: 150, filter: 'set', filterParams: { newRowsAction: 'keep' } },
    {headerName: "City", field: "City", width: 150, suppressMenu: true},
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
    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSize = 'pageSize=' + (params.endRow - params.startRow);
    var pageNum = 'pageNum=' + params.startRow / (params.endRow - params.startRow);
    var sortOrder = 'sort=' + params.sortModel.colId;
    var agg = "agg=";
    var sortDirection = "sortDirection=";
    var city = "city=";
    var market = "market="; 
    var region = "regiion="; 
    var orgUnit = "orgUnit="; 
    var practice = "practice="; 
    var position = "position="; 
    var StartDateParam = "startDate=";
    var EndDateParam = "enddate";

    filters += pageSize + '&' + pageNum;

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
    var newColumns = [{
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
    ]

    for (var j = 0; j < resourcePage.TimePeriods.length; j++) {
        var timePeriod = resourcePage.TimePeriods[j];
        newColumns[j + 4] = {
            headerName: timePeriod, field: timePeriod, width: 150, suppressMenu: true, 
            cellRenderer: function (params) {
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
            }
        }
    }

    return newColumns;
}

function createRows(resourcePage) {
    var rows = [resourcePage.Resources.length];

    for (var i = 0; i < resourcePage.Resources.length; i++) {
        rows[i] = createRow(resourcePage.Resources[i], resourcePage.TimePeriods);
    }

    return rows;
}

function createRow(resource, timePeriods) {
    var row = {};

    row.FirstName = resource.FirstName;
    row.LastName = resource.LastName;
    row.City = resource.City;
    row.Position = resource.Position;
    row.Id = resource.Id;

    for (var j = 0; j < timePeriods.length; j++) {
        row[timePeriods[j]] = '';
    }

    for (var j = 0; j < resource.Assignments.length; j++) {
        var timePeriod = resource.Assignments[j].TimePeriod;

        row[timePeriod] = resource.Assignments[j].ActualHours;
    }

    return row;
}