document.addEventListener('DOMContentLoaded', function () {

    var authContext = new AuthenticationContext(config);

    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (error || !token) {
            alert('ADAL Error: ' + error);
            return;
        }
        getDropDownData(token);
    });

    var filterButton = document.getElementById("filterButton");

    filterButton.onclick = function () {
        count++;
        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: getData
        };

        grids[0].options.api.setDatasource(dataSource);

        grids[0].options.api.refreshHeader();
    }

    initializeResourceGrid();
    initializeResourceDetailGrid();

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        dismissModal();
    }

    var modal = document.getElementById('myModal');

    window.onclick = function (event) {
        if (event.target == modal) {
            dismissModal();
        }
    }
});

var count = 10;
var columnHeaders = {};
var selectedResource = {};
var currentColumns = [];

getDropDownData = function (token) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'api/dropdown');
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                httpResponse = JSON.parse(httpRequest.responseText);

                var citiesDropdown = document.getElementById("citiesDropdown");
                var orgUnitsDropdown = document.getElementById("orgUnitsDropdown");
                var regionsDropdown = document.getElementById("regionsDropdown");
                var marketsDropdown = document.getElementById("marketsDropdown");
                var practicesDropdown = document.getElementById("practicesDropdown");

                var citiesNoneOption = document.createElement('option');
                citiesNoneOption.text = 'None';
                citiesNoneOption.value = -1;

                var orgUnitsNoneOption = document.createElement('option');
                orgUnitsNoneOption.text = 'None';
                orgUnitsNoneOption.value = -1;

                var regionsNoneOption = document.createElement('option');
                regionsNoneOption.text = 'None';
                regionsNoneOption.value = -1;

                var regionsNoneOption = document.createElement('option');
                regionsNoneOption.text = 'None';
                regionsNoneOption.value = -1;

                var marketsNoneOption = document.createElement('option');
                marketsNoneOption.text = 'None';
                marketsNoneOption.value = -1;

                var practicesNoneOption = document.createElement('option');
                practicesNoneOption.text = 'None';
                practicesNoneOption.value = -1;

                citiesDropdown.appendChild(citiesNoneOption);
                orgUnitsDropdown.appendChild(orgUnitsNoneOption);
                regionsDropdown.appendChild(regionsNoneOption);
                marketsDropdown.appendChild(marketsNoneOption);
                practicesDropdown.appendChild(practicesNoneOption);

                for (var i = 0; i < httpResponse.length; i++) {
                    var option = document.createElement('option');
                    option.text = httpResponse[i].Name;
                    option.value = httpResponse[i].Id;

                    if (httpResponse[i].Category == 'OrgUnit') {
                        citiesDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'City') {
                        citiesDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Region') {
                        regionsDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Market') {
                        marketsDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Practice') {
                        practicesDropdown.appendChild(option);
                    }
                }
            }
            else {
            }
        }
    }
}

function initializeResourceGrid() {
    var resourceGrid = grids[0];
    var gridDiv = document.querySelector(resourceGrid.name);
    new agGrid.Grid(gridDiv, resourceGrid.options);

    resourceGrid.options.context = resourceGrid.name;

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: getData
    };

    resourceGrid.options.api.setColumnDefs(startingResourceColumnDefs);

    resourceGrid.options.api.setDatasource(dataSource);
}

function initializeResourceDetailGrid() {
    var resourceDetailGrid = grids[1];
    resourceDetailGrid.options.context = resourceDetailGrid.name;

    var gridDiv = document.querySelector(resourceDetailGrid.name);
    new agGrid.Grid(gridDiv, resourceDetailGrid.options);

    resourceDetailGrid.options.context = resourceDetailGrid.name;
}

function dismissModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    var selectedRows = grids[0].options.api.getSelectedNodes();
    selectedRows[0].setSelected(false);
}

function getData(params) {
    var grid = getGrid(params.context);

    var query = grid.queryBuilder(params);
    callServerAuth(params, query, grid.options, grid.createRow, grid.getInitialColumns, grid.createColumn, grid.getRowData, grid.getColumnData);
}

function getGrid(gridName) {
    for (var i = 0; i < grids.length; i++) {
        if (grids[i].name == gridName) {
            return grids[i];
        }
    }
}

function callServerAuth(params, query, options, populateRow, getInitialColumns, createColumns, getRowData, getColumnData) {
    var authContext = new AuthenticationContext(config);

    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (error || !token) {
            alert('ADAL Error: ' + error);
            return;
        }
        callServer(params, query, options, populateRow, getInitialColumns, createColumns, getRowData, getColumnData, token);
    });

}

function callServer(params, query, options, populateRow, getInitialColumns, createColumns, getRowData, getColumnData, token) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', query);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                httpResponse = JSON.parse(httpRequest.responseText);

                var rowData = getRowData(httpResponse);
                var columnData = getColumnData(httpResponse);

                if (httpResponse.ResourceInfo != null) {
                    updateSelectedUser(httpResponse.ResourceInfo);

                    var gridModal = document.getElementById('myGrid2');
                    gridModal.style.display = "block";
                }

                updateGrid(params, httpResponse, rowData, columnData, options, populateRow, getInitialColumns, createColumns);
            }
            else {
                $("#selectedUser").text("Error: " + httpRequest.statusText + ", " + httpRequest.responseText);
            }
            
        }
    };
}

function updateGrid(params, data, rowData, columnData, options, populateRow, getInitialColumns, createColumns) {
    var initialColumns = getInitialColumns();
    var columns = createColumns(initialColumns, data);
    var rows = createRows(rowData, columnData, populateRow);

    var columnsChanged = checkForColumnChanges(currentColumns, columns);

    if (columnsChanged) {
        options.api.setColumnDefs(columns);
        currentColumns = columns;
    }

    params.successCallback(rows, data.TotalRowCount);
}

function checkForColumnChanges(oldColumns, newColumns) {

    for (var i = 0; i < newColumns.length; i++) {
        if (oldColumns.length !== newColumns.length)
            return true;
        for (var i = oldColumns.length; i--;) {
            if (oldColumns[i].field !== newColumns[i].field)
                return true;
            if (oldColumns[i].field !== newColumns[i].field)
                return true;
        }

        return false;
    }
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

function getResourceRowData(data) {
    return data.Resources;
}

function getResourceColumnData(data) {
    return data.TimePeriods;
}

function getResourceDetailRowData(data) {
    return data.Projects;
}

function getResourceDetailColumnData(data) {
    return data.TimePeriods;
}

function getInitialResourceColumns() {
    return startingResourceColumnDefs;
}

function getInitialResourceDetailColumns() {
    return startingResourceDetailColumnDefs;
}

var grids = [
    {
        getRowData: getResourceRowData,
        getColumnData: getResourceColumnData,
        getInitialColumns: getInitialResourceColumns,
        name: '#myGrid',
        createRow: createResourceRow,
        createColumn: createResourceColumns,
        options: {
            context: 0,
            debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: 'single',
            rowDeselection: true,
            columnDefs: startingResourceColumnDefs,
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
        queryBuilder: buildResourceQuery
    },
    {
        getRowData: getResourceDetailRowData,
        getColumnData: getResourceDetailColumnData,
        getInitialColumns: getInitialResourceDetailColumns,
        name: '#myGrid2',
        createRow: createProjectRow,
        createColumn: createResourceColumns,
        options: {
            context: 1,
            debug: true,
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            rowSelection: 'single',
            rowDeselection: true,
            columnDefs: startingResourceDetailColumnDefs,
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
        queryBuilder: buildResourceDetailQuery
    }
];

var startingResourceColumnDefs = [
    {
        headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true,
        cellRenderer: function (params) {
            if (params.data !== undefined) {
                return params.value;
            } else {
                return '<img src="../images/loading.gif">'
            }
        },
        pinned: 'left'
    },
    { headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: { newRowsAction: 'keep' }, pinned: 'left' },
    { headerName: "Position", field: "Position", width: 150, filter: 'set', filterParams: { newRowsAction: 'keep' } },
    { headerName: "City", field: "City", width: 150, suppressMenu: true },
];

var startingResourceDetailColumnDefs = [
    {
        headerName: "Project Name", field: "ProjectName", width: 150, suppressMenu: true,
        pinned: true,
        cellRenderer: function (params) {
            if (params.data !== undefined) {
                return params.value;
            } else {
                return '<img src="../images/loading.gif">'
            }
        },
    },
];

function createResourceColumns(startingColumns, columns) {
    var columnCount = startingColumns.length;

    if (columns != null && columns.TimePeriods != null) {
        columnCount == columns.TimePeriods.length;
    }

    var newColumns = [columnCount];

    //add initial colummns, defined in startingColumnDefs
    for (var i = 0; i < startingColumns.length; i++) {
        var column = startingColumns[i];

        newColumns[i] = column;
    }

    if (columns != null && columns.TimePeriods != null) {
        //add time periods as columns
        for (i = 0; i < columns.TimePeriods.length; i++) {
            var timePeriod = columns.TimePeriods[i];
            column = createColumn(timePeriod);

            var newColumnIndex = i + startingColumns.length;
            newColumns[newColumnIndex] = column;
        }
    }

    return newColumns;
}

function createColumn(timePeriod) {
    return {
        period: timePeriod,
        //headerValueGetter: getHeader,
        headerName: timePeriod,
        suppressMenu: true,
        children: [
            { headerName: "Actual", width: 67, field: timePeriod + "ActualHours"  , cellRenderer: timePeriodCellRenderer },
            { headerName: "Frcst" , width: 67, field: timePeriod + "ForecastHours", cellRenderer: timePeriodCellRenderer }
        ]
    };
}

function getHeader(params) {
    return "wahoo" + count;//columnHeaders[params.colDef.field];
}

function buildResourceQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    var city     = document.getElementById('citiesDropdown'   ).value;
    var orgUnit  = document.getElementById('orgUnitsDropdown' ).value;
    var region   = document.getElementById('regionsDropdown'  ).value;
    var market   = document.getElementById('marketsDropdown'  ).value;
    var practice = document.getElementById('practicesDropdown').value;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSizeParam = 'pageSize=' + pageSize;
    var pageNumParam = '&pageNum=' + pageNum;

    filters += pageSizeParam + pageNumParam;

    var aggParam = "agg=";
    
    if (city != -1) {
        filters += "&city=" + city;
    }

    if (orgUnit != -1 && orgUnit != '') {
        filters += "&orgUnit=" + orgUnit;
    }

    if (region != -1 && region != '') {
        filters += "&region=" + region;
    }

    if (market != -1 && market != '') {
        filters += "&market=" + market;
    }

    if (practice != -1 && practice != '') {
        filters += "&practice=" + practice;
    }

    if (params.sortModel.length > 0) {
        filters += '&sortOrder=' + params.sortModel[0].colId;
        filters += "&sortDirection=" + params.sortModel[0].sort;
    }

    var query = 'api/resource' + filters;

    return query;
}

function buildResourceDetailQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    if (params.Id !== null) {
        filters += "ResourceId=" + selectedResource.Id;
    }

    var query = 'api/resourcedetail' + filters;

    return query;
}

function createResourceRow(row, resource, timePeriods) {
    addResourceDetails(row, resource            );
    addTimePeriods    (row, timePeriods         );
    addAssignments    (row, resource.Assignments);
}

function createProjectRow(row, project, timePeriods) {
    addProjectDetails(row, project            );
    addTimePeriods   (row, timePeriods        );
    addAssignments   (row, project.Assignments);
}

function addTimePeriods(row, timePeriods) {
    for (var i = 0; i < timePeriods.length; i++) {
        var timePeriod = timePeriods[i];

        row[timePeriod] = '';
    }
}

function addResourceDetails(row, resource) {
    row.FirstName = resource.FirstName;
    row.LastName  = resource.LastName;
    row.City      = resource.City;
    row.Position  = resource.Position;
    row.Id        = resource.ResourceId;
}

function addProjectDetails(row, project) {
    row.ProjectName               = project.ProjectName;
    row.FirstName                 = project.FirstName;
    row.LastName                  = project.LastName;
    row.WBSElement                = project.WBSElement; 
    row.Customer                  = project.Customer; 
    row.Description               = project.Description;
    row.OpportunityOwnerFirstName = project.OpportunityOwnerFirstName;
    row.OpportunityOwnerLastName  = project.OpportunityOwnerLastName 
    row.ProjectManagerFirstName   = project.ProjectManagerFirstName;
    row.ProjectManagerLastName    = project.ProjectManagerLastName;
}

function addAssignments(row, assignments) {
    for (i = 0; i < assignments.length; i++) {
        var assignment = assignments[i];
        timePeriod = assignment.TimePeriod;

        addAssignment(row, assignment, timePeriod);
    }
}

function addAssignment(row, assignment, timePeriod) {
    var actualHoursIndex   = timePeriod + "ActualHours";
    var forecastHoursIndex = timePeriod + "ForecastHours";

    row[actualHoursIndex  ] = assignment.ActualHours;
    row[forecastHoursIndex] = assignment.ForecastHours;
}

function rowSelectedFunc(event) {
    $("#selectedUser").text("loading...");

    if (event.node.isSelected()) {

        var modal = document.getElementById('myModal');
        modal.style.display = "block";

        var gridModal = document.getElementById('myGrid2');
        gridModal.style.display = "none";

        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: getData
        };

        selectedResource.Id = event.node.data.Id;
        
        grids[1].options.api.setDatasource(dataSource);
    }
}

function updateSelectedUser(data) {
    $("#selectedUser").text("first Name: "  + data.FirstName + ", Last Name: " + data.LastName);
}