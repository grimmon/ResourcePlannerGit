var resourceDetailGrid = {
    name: '#myGrid2',
    options: {
        debug: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        enableColResize: true,
        rowSelection: 'single',
        rowDeselection: true,
        rowModelType: 'virtual',
        paginationPageSize: 30,
        paginationOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        paginationInitialRowCount: 1,
        maxPagesInCache: 6,
        defaultColGroupDef: { headerClass: headerClassFunc },
        defaultColDef: { headerClass: headerClassFunc },
        getRowNodeId: function (item) {
            return item.Id;
        }
    },
    currentDate: new Date(),
    currentAggregation: {},
    pageSize: 8
};

var startingResourceDetailColumnDefs = [
    { context: { type: "resourceDetailColumn", index: 0 }, field: "ProjectName"     , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 1 }, field: "ProjectNumber"   , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 2 }, field: "WBSElement"      , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 3 }, field: "Client"          , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 4 }, field: "OpportunityOwner", width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 5 }, field: "ProjectManager"  , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "resourceDetailColumn", index: 6 }, field: "Description"     , width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer }
];

function initializeResourceDetailGrid() {
    var gridDiv = document.querySelector(resourceDetailGrid.name);
    new agGrid.Grid(gridDiv, resourceDetailGrid.options);

    var startingResourceColumns = createColumns(startingResourceDetailColumnDefs, "resourceDetailGroupColumn");
    resourceDetailGrid.options.api.setColumnDefs(startingResourceColumns);
}

function refreshResourceDetailGridEvent(event) {
    if (event != undefined && event.node.isSelected()) {
        refreshResourceDetailGrid();
        updateSelectedUser(event.node.data);
    }
}

function refreshResourceDetailGrid() {
    if (selectedResource != undefined && selectedResource.Id != undefined) {
        resourceDetailGrid.options.api.showLoadingOverlay();

        var dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: function getResourceDetailData(params) {
                var query = buildResourceDetailQuery(params);
                callServerWithResponseAuth('GET', params, query, onCallResourceDetailSuccess, showError);
            }
        };

        resourceDetailGrid.options.api.setDatasource(dataSource);
    }
}

function updateSelectedUser(data) {
    $("#selectedUser").text("Resource Detail: " + (data.ResourceName == null ? "" : data.ResourceName));
    $('#collapseOne').collapse('show');
}

function buildResourceDetailQuery(params) {
    var filters = '?';

    if (params.Id !== null) {
        filters += "ResourceId=" + selectedResource.Id;
    }

    var aggregation = document.getElementById('aggregationsDropdown').value;
    
    var startDate = dateTimeUtility.getStartDate(resourceDetailGrid.currentDate, resourceDetailGrid.currentAggregation, resourceDetailGrid.pageSize);
    var endDate = dateTimeUtility.getEndDate(resourceDetailGrid.currentDate, resourceDetailGrid.currentAggregation, resourceDetailGrid.pageSize);

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
    var columns = createColumns(startingResourceDetailColumnDefs, data.TimePeriods);
    var rows = createRows(rowData, columnData, createProjectRow);

    for (var i = 0; i < httpResponse.TimePeriods.length; i++) {
        var timePeriod = httpResponse.TimePeriods[i];
        resourceDetailGroupHeaders[i] = timePeriod;
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
    row.ProjectName      = project.ProjectName;
    row.ProjectNumber    = project.ProjectNumber;
    row.WBSElement       = project.WBSElement; 
    row.Customer         = isNullOrUndefined(project.Customer) ? "" : project.Customer; 
    row.Description      = isNullOrUndefined(project.Description) ? "" : project.Description;
    row.OpportunityOwner = isNullOrUndefined(project.OpportunityOwnerLastName) ? "" : (project.OpportunityOwnerLastName + ", " + project.OpportunityOwnerFirstName); 
    row.ProjectManager   = isNullOrUndefined(project.ProjectManagerLastName) ? "" : (project.ProjectManagerLastName + ", " + project.ProjectManagerFirstName);
}

function updateResourceDetailAggregation(aggregation) {
    resourceDetailGrid.currentAggregation = aggregation;
}

function exportToExcel() {

}