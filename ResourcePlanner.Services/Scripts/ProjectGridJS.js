var projectGrid = {
    name: '#projectGrid',
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

var startingProjectColumnDefs = [
    { context: { type: "projectColumn", index: 0 }, field: "ResourceName", width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "projectColumn", index: 1 }, field: "Position", width: 150, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "projectColumn", index: 2 }, field: "CostRate", width: 100, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "projectColumn", index: 3 }, field: "TotalResourceHours", width: 100, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer },
    { context: { type: "projectColumn", index: 4 }, field: "TotalForecastHours", width: 100, suppressMenu: true, pinned: true, cellRenderer: loadingCellRenderer }
];

function initializeProjectGrid() {
    var gridDiv = document.querySelector(projectGrid.name);
    new agGrid.Grid(gridDiv, projectGrid.options);

    var startingProjectColumns = createColumns(startingProjectColumnDefs, "projectGroupColumn", projectGrid.pageSize);
    projectGrid.options.api.setColumnDefs(startingProjectColumns);
}

function openProjectView(projectId) {
    $("#projectViewModal").modal("show");
    refreshProjectGrid(projectId);
}

function refreshProjectGrid(projectId) {
    
    projectGrid.options.api.showLoadingOverlay();

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function getProjectData(params) {
            var query = buildProjectQuery(projectId);
            callServerWithResponseAuth('GET', params, query, onCallProjectSuccess, showError);
        }
    };

    projectGrid.options.api.setDatasource(dataSource);
}

function buildProjectQuery(projectId) {
    var filters = '?projectid=' + projectId;
    var query = 'api/ProjectView' + filters;
    return query;
}

function onCallProjectSuccess(params, query, httpResponse) {
    updateProjectGrid(params, httpResponse, httpResponse.ProjectResource, httpResponse.TimePeriods, projectGrid.options);
}

function updateProjectGrid(params, data, rowData, columnData, options) {
    projectGrid.pageSize = data.TimePeriods.length;
    var columns = createColumns(startingProjectColumnDefs, data.TimePeriods, projectGrid.pageSize);
    projectGrid.options.api.setColumnDefs(columns);
    var rows = createRows(rowData, columnData, createProjectRow);

    for (var i = 0; i < httpResponse.TimePeriods.length; i++) {
        var timePeriod = httpResponse.TimePeriods[i];
        projectGroupHeaders[i] = timePeriod;
    }

    params.successCallback(rows, data.TotalRowCount);
    projectGrid.options.api.hideOverlay();
    projectGrid.options.api.refreshHeader();
}

function createProjectRow(row, resource, timePeriods) {
    addProjectData(row, resource);
    addTimePeriods(row, timePeriods);
    addAssignments(row, resource.Assignments);
}

function addProjectData(row, resource) {
    row.ResourceName = (!isNullOrUndefined(resource.LastName) ? resource.LastName + ", " : "") + resource.FirstName;
    row.Position = resource.Position;
    row.CostRate = resource.CostRate;
    row.TotalResourceHours = resource.TotalResourceHours;
    row.TotalForecastHours = resource.TotalForecastHours;
}

function updateProjectAggregation(aggregation) {
    projectGrid.currentAggregation = aggregation;
}

function exportToExcel() {

}