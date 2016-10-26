﻿var resourceDetailGrid = {
    name: '#myGrid2',
    options: {
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
    }
};

var startingResourceDetailColumnDefs = [
    { headerName: "Project Name", field: "ProjectName", width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
];

function initializeResourceDetailGrid() {
    var gridDiv = document.querySelector(resourceDetailGrid.name);
    new agGrid.Grid(gridDiv, resourceDetailGrid.options);
}

function refreshResourceDetailGrid(event) {
    if (event.node.isSelected()) {
        resourceDetailGrid.options.api.showLoadingOverlay();

        selectedResource.Id = event.node.data.Id;

        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: function getResourceDetailData(params) {
                var query = buildResourceDetailQuery(params);
                callResourceServerAuth(params, query, onCallResourceDetailSuccess, showError);
            }
        };

        $("#selectedUser").text("loading...");
        resourceDetailGrid.options.api.setDatasource(dataSource);
        updateSelectedUser(event.node.data);
    }
}

function updateSelectedUser(data) {
    $("#selectedUser").text("first Name: " + data.FirstName + ", Last Name: " + data.LastName);
}

function buildResourceDetailQuery(params) {
    var filters = '?';

    if (params.Id !== null) {
        filters += "ResourceId=" + selectedResource.Id;
    }

    var aggregation = document.getElementById('aggregationsDropdown').value;
    var startDate   = document.getElementById('startDateInput'      ).value;
    var endDate     = document.getElementById('endDateInput'        ).value;

    filters += "&startDate=" + startDate;
    filters += "&endDate=" + endDate;

    if (aggregation != -1 && aggregation != '') { filters += "&agg=" + aggregation; }

    var query = 'api/resourcedetail' + filters;

    return query;
}

function onCallResourceDetailSuccess(params, query, httpResponse) {
    updateResourceDetailGrid(params, httpResponse, httpResponse.Projects, httpResponse.TimePeriods, resourceDetailGrid.options);
}

function updateResourceDetailGrid(params, data, rowData, columnData, options) {
    var columns = createResourceColumns(startingResourceDetailColumnDefs, data);
    var rows = createRows(rowData, columnData, createProjectRow);

    var columnsChanged = checkForColumnChanges(currentColumns, columns);

    if (columnsChanged) {
        options.api.setColumnDefs(columns);
        currentColumns = columns;
    }

    params.successCallback(rows, data.TotalRowCount);
    resourceDetailGrid.options.api.hideOverlay();
}

function createProjectRow(row, project, timePeriods) {
    addProjectData(row, project            );
    addTimePeriods(row, timePeriods        );
    addAssignments(row, project.Assignments);
}

function addProjectData(row, project) {
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