

var resourceAssignmentGrid = {
    name: '#AssignmentGrid',
    options: {
        debug: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        enableColResize: true,
        rowSelection: 'multiple',
        rowDeselection: true,
        rowModelType: 'virtual',
        paginationPageSize: 300,
        paginationOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        paginationInitialRowCount: 1,
        maxPagesInCache: 6,
        defaultColGroupDef: { headerClass: headerClassFunc },
        defaultColDef: { headerClass: headerClassFunc },
        onRowSelected: rowSelectedFunc,
        getRowNodeId: function (item) {
            return item.Id;
        }
    },
    currentDate: new Date(),
    currentAggregation: {},
    pageSize: 8
};

var startingResourceAssignmentColumnDefs = [
    { context: { type: "resourceColumn", index: 0 }, headerName: "Resource", field: "ResourceName", width: 300, suppressMenu: true, pinned: 'left', cellRenderer: loadingCellRenderer, checkboxSelection: true},
    { context: { type: "resourceColumn", index: 1 }, headerName: "Position", field: "Position", width: 150, suppressMenu: true, pinned: 'left' },
];

function initializeResourceAssignmentGrid() {
    var gridDiv = document.querySelector(resourceAssignmentGrid.name);
    new agGrid.Grid(gridDiv, resourceAssignmentGrid.options);

    var startingResourceAssignmentColumns = createAssignmentColumns(startingResourceAssignmentColumnDefs, "resourceAssignmentGroupColumn");
    resourceAssignmentGrid.options.api.setColumnDefs(startingResourceAssignmentColumns);

    //refreshResourceAssignmentGrid();
}

function refreshResourceAssignmentGrid() {
    resourceAssignmentGrid.options.api.showLoadingOverlay();

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function getResourceAssignmentData(params) {
            var query = buildResourceAssignmentQuery(params);
            callResourceServerAuth(params, query, onCallResourceAssignmentSuccess, showError);
        }
    };

    resourceAssignmentGrid.options.api.setDatasource(dataSource);
}

function buildResourceAssignmentQuery(params) {
    var pageSize = (params.endRow - params.startRow);
    var pageNum = params.startRow / pageSize;

    console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    var filters = '?';

    var pageSizeParam = 'pageSize=' + pageSize;
    var pageNumParam = '&pageNum=' + pageNum;

    filters += pageSizeParam + pageNumParam;

    var title = $(".position-selector").select2("val");

    var searchTerm1 = $("#myTags").tagit("assignedTags")[0];
    var searchTerm2 = $("#myTags").tagit("assignedTags")[1];
    var searchTerm3 = $("#myTags").tagit("assignedTags")[2];

    var startDate = dateTimeUtility.getStartDate(resourceAssignmentGrid.currentDate, resourceAssignmentGrid.currentAggregation, resourceAssignmentGrid.pageSize);
    var endDate = dateTimeUtility.getEndDate(resourceAssignmentGrid.currentDate, resourceAssignmentGrid.currentAggregation, resourceAssignmentGrid.pageSize);

    var formattedStartDate = dateTimeUtility.formatDate(startDate);
    var formattedEndDate = dateTimeUtility.formatDate(endDate);

    filters += "&startDate=" + formattedStartDate;
    filters += "&endDate=" + formattedEndDate;
    filters += "&availability=true"

    if (title != null){
        if (title.length > 0) {
            filters += "&title=";
            for (i = 0; i < title.length; i++) {
                if (title[i] != "") {
                    if (i > 0) {
                        filters += ",";
                    }
                    filters += title[i];
                }
            }
        }
    }
   
    if (searchTerm1 != null && searchTerm1 != '') { filters += "&searchterm1=" + searchTerm1; }
    if (searchTerm2 != null && searchTerm2 != '') { filters += "&searchterm2=" + searchTerm2; }
    if (searchTerm3 != null && searchTerm3 != '') { filters += "&searchterm3=" + searchTerm3; }

    if (params.sortModel.length > 0) {
        filters += '&sortOrder=' + params.sortModel[0].colId;
        filters += "&sortDirection=" + params.sortModel[0].sort;
    }

    var query = 'api/resource' + filters;

    return query;
}

function onCallResourceAssignmentSuccess(params, query, httpResponse) {
    var rows = createRows(httpResponse.Resources, httpResponse.TimePeriods, createResourceAssignmentRow);

    for (var i = 0; i < httpResponse.TimePeriods.length; i++) {
        var timePeriod = httpResponse.TimePeriods[i];
        resourceAssignmentGroupHeaders[i] = timePeriod;
    }

    params.successCallback(rows, httpResponse.TotalRowCount);
    resourceAssignmentGrid.options.api.hideOverlay();
    resourceAssignmentGrid.options.api.refreshHeader();
}

function createResourceAssignmentRow(row, resource, timePeriods) {
    addResourceAssignmentData(row, resource);
    addTimePeriods(row, timePeriods);
    addResourceAssignments(row, resource.Assignments);
}

function addResourceAssignmentData(row, resource) {
    row.ResourceName = (resource.LastName + ", " || "") + resource.FirstName;
    row.Position = resource.Position;
    row.Id = resource.ResourceId;
}

function updateResourceAssignmentAggregation(aggregation) {
    resourceAssignmentGrid.currentAggregation = aggregation;
}