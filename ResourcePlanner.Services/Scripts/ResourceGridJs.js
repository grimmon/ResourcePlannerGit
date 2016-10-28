var resourceGrid = {
    name: '#myGrid',
    options: {
        debug: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        enableColResize: true,
        rowSelection: 'single',
        rowDeselection: true,
        columnDefs: startingResourceColumnDefs,
        rowModelType: 'virtual',
        paginationPageSize: 300,
        paginationOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        paginationInitialRowCount: 1,
        maxPagesInCache: 6,
        onRowSelected: rowSelectedFunc,
        getRowNodeId: function (item) {
            return item.Id;
        }
    }
};

var startingResourceColumnDefs = [
    { headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true, pinned: 'left', cellRenderer: loadingCellRenderer },
    { headerName: "Last Name" , field: "LastName" , width: 150, suppressMenu: true, pinned: 'left'},
    { headerName: "Position"  , field: "Position" , width: 150, suppressMenu: true },
    { headerName: "City"      , field: "City"     , width: 150, suppressMenu: true },
];

function hi() {
}

function initializeResourceGrid() {
    var gridDiv = document.querySelector(resourceGrid.name);
    new agGrid.Grid(gridDiv, resourceGrid.options);

    refreshResourceGrid();
}

function refreshResourceGrid() {
    resourceGrid.options.api.showLoadingOverlay();

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function getResourceData(params) {
            var query = buildResourceQuery(params);
            callResourceServerAuth(params, query, onCallResourceSuccess, showError);
        }
    };

    resourceGrid.options.api.setDatasource(dataSource);
    resourceGrid.options.api.refreshHeader();
}

function buildResourceQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSizeParam = 'pageSize=' + pageSize;
    var pageNumParam  = '&pageNum=' + pageNum;

    filters += pageSizeParam + pageNumParam;

    var city        = document.getElementById('citiesDropdown'      ).value;
    var orgUnit     = document.getElementById('orgUnitsDropdown'    ).value;
    var region      = document.getElementById('regionsDropdown'     ).value;
    var market      = document.getElementById('marketsDropdown'     ).value;
    var practice    = document.getElementById('practicesDropdown'   ).value;
    var aggregation = document.getElementById('aggregationsDropdown').value;
    var startDate   = document.getElementById('startDateInput'      ).value;
    var endDate     = document.getElementById('endDateInput'        ).value;

    filters += "&startDate=" + startDate;
    filters += "&endDate="   + endDate;

    if (city        != -1 && city        != '') { filters += "&city="     + city;        }
    if (orgUnit     != -1 && orgUnit     != '') { filters += "&orgUnit="  + orgUnit;     }
    if (region      != -1 && region      != '') { filters += "&region="   + region;      }
    if (market      != -1 && market      != '') { filters += "&market="   + market;      }
    if (practice    != -1 && practice    != '') { filters += "&practice=" + practice;    }
    if (aggregation != -1 && aggregation != '') { filters += "&agg="      + aggregation; }

    if (params.sortModel.length > 0) {
        filters += '&sortOrder='     + params.sortModel[0].colId;
        filters += "&sortDirection=" + params.sortModel[0].sort;
    }

    var query = 'api/resource' + filters;

    return query;
}

function onCallResourceSuccess(params, query, httpResponse) {
    var columns = createResourceColumns(startingResourceColumnDefs, httpResponse);
    var rows = createRows(httpResponse.Resources, httpResponse.TimePeriods, createResourceRow);

    var columnsChanged = checkForColumnChanges(currentColumns, columns);

    if (columnsChanged) {
        resourceGrid.options.api.setColumnDefs(columns);

        var detailColumns = createResourceColumns(startingResourceDetailColumnDefs, httpResponse);
        resourceDetailGrid.options.api.setColumnDefs(detailColumns);

        currentColumns = columns;
    }

    params.successCallback(rows, httpResponse.TotalRowCount);
    resourceGrid.options.api.hideOverlay();
}

function createResourceRow(row, resource, timePeriods) {
    addResourceData(row, resource            );
    addTimePeriods (row, timePeriods         );
    addAssignments (row, resource.Assignments);
}

function addResourceData(row, resource) {
    row.FirstName = resource.FirstName;
    row.LastName  = resource.LastName;
    row.City      = resource.City;
    row.Position  = resource.Position;
    row.Id        = resource.ResourceId;
}

function rowSelectedFunc(event) {
    if (event.node.isSelected()) {
        selectedResource.Id = event.node.data.Id;
        refreshResourceDetailGrid(event);
    }
}