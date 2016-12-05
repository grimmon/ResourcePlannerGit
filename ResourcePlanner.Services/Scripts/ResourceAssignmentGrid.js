

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
        onRowSelected: rowsSelectedFunc,
        getRowNodeId: function (item) {
            return item.Id;
        }
    },
    currentDate: new Date(),
    currentAggregation: {},
    pageSize: 8
};

var startingResourceAssignmentColumnDefs = [
    { context: { type: "resourceColumn", index: 0 }, headerName: "ResourceName", field: "ResourceName", width: 300, suppressMenu: true, pinned: 'left', cellRenderer: loadingCellRenderer, checkboxSelection: true},
    { context: { type: "resourceColumn", index: 1 }, headerName: "Position", field: "Position", width: 150, suppressMenu: true, pinned: 'left' },
];

function initializeResourceAssignmentGrid() {
    var gridDiv = document.querySelector(resourceAssignmentGrid.name);
    new agGrid.Grid(gridDiv, resourceAssignmentGrid.options);

    var startingResourceAssignmentColumns = createAssignmentColumns(startingResourceAssignmentColumnDefs, "resourceAssignmentGroupColumn");
    resourceAssignmentGrid.options.api.setColumnDefs(startingResourceAssignmentColumns);
    resourceAssignmentGrid.options.api.addEventListener("rowSelected", function () {
        if (readyForAssignmentSave()) {
            $("#saveAssignment").prop("disabled", false);
        }
        else {
            $("#saveAssignment").prop("disabled", true);
        }
    });

    //refreshResourceAssignmentGrid();
}

function refreshResourceAssignmentGrid() {
    resourceAssignmentGrid.options.api.showLoadingOverlay();

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function getResourceAssignmentData(params) {
            var query = buildResourceAssignmentQuery(params);
            callServerWithResponseAuth('GET', params, query, onCallResourceAssignmentSuccess, showError);
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
    var practice    = document.getElementById('assignmentPracticesDropdown'   ).value;
    var subPractice = document.getElementById('assignmentSubpracticesDropdown').value;

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

    if (practice > 0 && practice != '') { filters += "&practice=" + practice; }
    if (subPractice > 0 && subPractice != '') { filters += "&subpractice=" + subPractice; }



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

function rowsSelectedFunc(event) {
    if (event.node.isSelected()) {
        selectedResources.Id = event.node.data.Id;
    }
}

function createResourceAssignmentRow(row, resource, timePeriods) {
    addResourceAssignmentData(row, resource);
    addTimePeriods(row, timePeriods);
    addResourceAssignments(row, resource.Assignments);
}


function addResourceAssignmentData(row, resource) {
    row.ResourceName = "<b>" + (resource.LastName + ", " || "") + resource.FirstName + "</b>";
    row.Position = resource.Position;
    row.Id = resource.ResourceId;
}

function updateResourceAssignmentAggregation(aggregation) {
    resourceAssignmentGrid.currentAggregation = aggregation;
}

function addAssignmentsToServer() {
    $("#saveAssignment").prop("disabled", true);
    var query = buildAssignmentInsertQuery();
    callServerAuth(query, onCallAddAssignmentSuccess, showError);
}

function buildAssignmentInsertQuery() {
    var filters = "?"
    var resourceIds = resourceAssignmentGrid.options.api.getSelectedRows();

    if (resourceIds != null) {
        if (resourceIds.length > 0) {
            filters += "resourceIds=";
            for (i = 0; i < resourceIds.length; i++) {
                if (resourceIds[i] != "") {
                    if (i > 0) {
                        filters += ",";
                    }
                    filters += resourceIds[i].Id;
                }
            }
        }
    }
    var projectId = $(".project-selector").select2("val");
    filters += "&projectId=" + projectId;
    var hours = document.getElementById("hoursPerDay").value;
    filters += "&hoursPerDay=" + hours;
    
    var startDate = $('#startdatepicker').data('DateTimePicker').date();
    var endDate = $('#enddatepicker').data('DateTimePicker').date();

    var formattedStartDate = dateTimeUtility.formatDate(new Date(startDate));
    var formattedEndDate = dateTimeUtility.formatDate(new Date(endDate));
    
    filters += "&startdate=" + formattedStartDate;
    filters += "&enddate=" + formattedEndDate;


    var daysOfWeek = $(".dayofweek-selector").select2("val");
    if (daysOfWeek != null) {
        if (daysOfWeek.length > 0) {
            filters += "&daysOfWeek=";
            for (i = 0; i < daysOfWeek.length; i++) {
                if (daysOfWeek[i] != "") {
                    if (i > 0) {
                        filters += ",";
                    }
                    filters += daysOfWeek[i];
                }
            }
        }
    }

    var query = 'api/addassignment' + filters;

    return query;
}

function onCallAddAssignmentSuccess(query)
{
    //$("#saveAssignment").prop('disabled', false);
    alert("Assignment Saved");
    
}

function readyForAssignmentSave() {
    var resourceIds = resourceAssignmentGrid.options.api.getSelectedRows();
    if (isNullOrUndefined(resourceIds)) { return false; }
        
    else{
        if (resourceIds.length <= 0) { return false; }
    }

    var projectId = $(".project-selector").select2("val");
    if (isNullOrUndefined(projectId)) { return false; }

    var hours = document.getElementById("hoursPerDay").value;
    if (isNullOrUndefined(hours)) { return false; }

    var startDate = $('#startdatepicker').data('DateTimePicker').date();
    var endDate = $('#enddatepicker').data('DateTimePicker').date();
    if (isNullOrUndefined(startDate) || isNullOrUndefined(endDate)) { return false; }

    return true;
}