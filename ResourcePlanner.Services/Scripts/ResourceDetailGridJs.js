var resourceDetailGrid = {
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
    if (event != undefined && event.node.isSelected()) {
        refresh();
        updateSelectedUser(event.node.data);
    }
}

function refresh() {
    if (selectedResource != undefined && selectedResource.Id != undefined) {
        resourceDetailGrid.options.api.showLoadingOverlay();

        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: function getResourceDetailData(params) {
                var query = buildResourceDetailQuery(params);
                callResourceServerAuth(params, query, onCallResourceDetailSuccess, showError);
            }
        };

        var startingResourceColumns = createResourceColumns(startingResourceDetailColumnDefs, startingColumns);

        resourceDetailGrid.options.api.setColumnDefs(startingResourceColumns);

        resourceDetailGrid.options.api.refreshHeader();

        resourceDetailGrid.options.api.setDatasource(dataSource);
    }
}

function updateSelectedUser(data) {
    $("#selectedUser").text("Resource Detail: " + data.FirstName + " " + data.LastName);
}

function buildResourceDetailQuery(params) {
    var filters = '?';

    if (params.Id !== null) {
        filters += "ResourceId=" + selectedResource.Id;
    }

    var aggregation = document.getElementById('aggregationsDropdown').value;
    
    var startDate = dateTimeUtility.getStartDate();
    var endDate = dateTimeUtility.getEndDate();

    var formattedStartDate = dateTimeUtility.formatDate(startDate);
    var formattedEndDate = dateTimeUtility.formatDate(endDate);

    filters += "&startDate=" + formattedStartDate;
    filters += "&endDate=" + formattedEndDate;

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

    for (var i = 0; i < httpResponse.TimePeriods.length; i++) {
        var timePeriod = httpResponse.TimePeriods[i];
        headers[i] = timePeriod;
    }

    params.successCallback(rows, data.TotalRowCount);
    resourceDetailGrid.options.api.hideOverlay();
    resourceDetailGrid.options.api.refreshHeader();
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