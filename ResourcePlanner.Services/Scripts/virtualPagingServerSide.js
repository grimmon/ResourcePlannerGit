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
            headerName: timePeriod, field: timePeriod, width: 150, suppressMenu: true
        }
    }

    return newColumns;
}

function createRows(resourcePage) {
    var flattenedRows = [resourcePage.Resources.length];

    for (var i = 0; i < resourcePage.Resources.length; i++) {
        var row = {};
        var currentObject = resourcePage.Resources[i];

        row.FirstName = currentObject.FirstName;
        row.LastName = currentObject.LastName;
        row.City = currentObject.City;
        row.Position = currentObject.Position;
        row.Id = currentObject.Id;

        for (var j = 0; j < resourcePage.TimePeriods.length; j++) {
            row[resourcePage.TimePeriods[j]] = '';
        }

        for (var j = 0; j < currentObject.Assignments.length; j++) {
            var timePeriod = currentObject.Assignments[j].TimePeriod;

            row[timePeriod] = currentObject.Assignments[j].ActualHours;
        }

        flattenedRows[i] = row;
    }

    return flattenedRows;
}