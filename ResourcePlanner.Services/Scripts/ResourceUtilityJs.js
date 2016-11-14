﻿var dataColumnsCount = 8;
var selectedResource = {};
var selectedResources = {};

var dataHeaders = [
    "actual",
    "forecast"
];

var resourceGroupHeaders = [];
var resourceDetailGroupHeaders = [];
var resourceAssignmentGroupHeaders = [];

var resourceHeaders = [
    "Resource",
     "Position",
     "City",
     "Practice",
     "Sub-Practice"
];

var resourceDetailHeaders = [
    "Project Name",
    "Project Number",
    "WBS Element",
    "Client",
    "Opportunity Owner",
    "Project Manager",
    "Description",
];

var resourceAssignmentHeaders = [
    "Resource",
    "Title"
]

document.addEventListener('DOMContentLoaded', function () {
    getDropdownValues();
    dateTimeInit();
    assignmentModalLoad();
    assignmentGridApply();
    assignmentSave();
});

function assignmentSave() {
    $("#saveAssignment").click(addAssignmentsToServer);
}

function assignmentModalLoad() {
    $("#assignmentModalLoad").click(refreshResourceAssignmentGrid);
}

function assignmentGridApply() {
    $("#assignmentGridApply").click(AssignmentApply);
}

function dropDownInit() {
    var query = 'api/dropdown';

    callResourceServerAuth(null, query, dropDownSuccessCallback, showError);
}

function dateTimeInit() {
    var now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    resourceGrid.currentDate = now;
    resourceDetailGrid.currentDate = now;
    resourceAssignmentGrid.currentDate = now;
    
    resourceGrid.pageSize = dataColumnsCount;
    resourceDetailGrid.pageSize = dataColumnsCount;
    resourceAssignmentGrid.pageSize = dataColumnsCount;
    
    resourceAssignmentGrid.currentAggregation = '1';
}

function onDropDownSuccess() {
    buttonHookups();

    var aggregationDropdown = document.getElementById("aggregationsDropdown");

    resourceGrid.currentAggregation = aggregationDropdown.value;
    resourceDetailGrid.currentAggregation = aggregationDropdown.value;

    initializeResourceGrid();
    initializeResourceDetailGrid();
    initializeResourceAssignmentGrid();
}

function buttonHookups() {
    var applyButton = document.getElementById("applyButton");
    var filterButton = document.getElementById("filterButton");
    var pageLeftButton = document.getElementById("pageLeftButton");
    var pageRightButton = document.getElementById("pageRightButton");
    var modal = document.getElementById("errorModal");
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    pageLeftButton.onclick = pageDown;
    pageRightButton.onclick = pageUp;

    applyButton.onclick = function () {
        var aggregation = document.getElementById('aggregationsDropdown').value;

        resourceGrid.currentAggregation = aggregation;
        resourceDetailGrid.currentAggregation = aggregation;

        refreshResourceGrid();
        refreshResourceDetailGrid();
    }

    filterButton.onclick = function () {
        $('#collapse1').collapse('toggle');
    }
}

function headerClassFunc(params) {
    if (params.colDef.context != undefined) {
        var columnType = params.colDef.context.type;
        var index = params.colDef.context.index;

        if (columnType == "resourceColumn") {
            params.colDef.headerName = resourceHeaders[index];
        }
        else if (columnType == "resourceDetailColumn") {
            params.colDef.headerName = resourceDetailHeaders[index];
        }
        else if (columnType == "resourceAssignmentColumn") {
            params.colDef.headerName = resourceAssignmentHeaders[index];
        }
        else if (columnType == "resourceGroupColumn") {
            params.colDef.headerName = resourceGroupHeaders[index];
        }
        else if (columnType == "resourceDetailGroupColumn") {
            params.colDef.headerName = resourceDetailGroupHeaders[index];
        }
        else if (columnType == "resourceAssignmentGroupColumn") {
            params.colDef.headerName = resourceAssignmentGroupHeaders[index];
        }
        else if (columnType == "dataColumn") {
            params.colDef.headerName = dataHeaders[index];
        }
        else if (columnType == "assignmentDataColumn") {
            params.colDef.headerName = assignmentDataHeaders[index];
        }
    }
}


function pageUp() {
    resourceGrid.currentDate = dateTimeUtility.updateCurrentDate(resourceGrid.currentDate, resourceGrid.currentAggregation, resourceGrid.pageSize, 1);
    resourceDetailGrid.currentDate = dateTimeUtility.updateCurrentDate(resourceDetailGrid.currentDate, resourceDetailGrid.currentAggregation, resourceDetailGrid.pageSize, 1);

    refreshResourceGrid();
    refreshResourceDetailGrid();
}

function pageDown() {
    resourceGrid.currentDate = dateTimeUtility.updateCurrentDate(resourceGrid.currentDate, resourceGrid.currentAggregation, resourceGrid.pageSize, -1);
    ResourceDetailGrid.currentDate = dateTimeUtility.updateCurrentDate(resourceDetailGrid.currentDate, resourceDetailGrid.currentAggregation, resourceDetailGrid.pageSize, - 1);

    refreshResourceGrid();
    refreshResourceDetailGrid();
}

function AssignmentApply() {
    var selectedStartDate = $('#startdatepicker').data('DateTimePicker').date();
    resourceAssignmentGrid.currentDate = new Date(selectedStartDate);

    refreshResourceAssignmentGrid();
}

function addTimePeriods(row, timePeriods) {
    for (var i = 0; i < timePeriods.length; i++) {
        var timePeriod = timePeriods[i];

        row[timePeriod] = '';
    }
}

function addAssignments(row, assignments) {
    for (i = 0; i < assignments.length; i++) {
        var assignment = assignments[i];
        timePeriod = assignment.TimePeriod;

        addAssignment(row, assignment, i);
    }
}

function addResourceAssignments(row, assignments) {
    for (i = 0; i < assignments.length; i++) {
        var assignment = assignments[i];
        timePeriod = assignment.TimePeriod;

        addResourceAssignment(row, assignment, i);
    }
}

function addAssignment(row, assignment, timePeriod) {
    var actualHoursIndex = timePeriod + "-ActualHours";
    var forecastHoursIndex = timePeriod + "-ForecastHours";

    row[actualHoursIndex] = assignment.ActualHours;
    row[forecastHoursIndex] = assignment.ForecastHours;
}

function addResourceAssignment(row, assignment, timePeriod) {
    var resourceHoursIndex = timePeriod + "-ResourceHours";

    row[resourceHoursIndex] = assignment.ResourceHours;
}


function showError(httpRequest, errorName) {
    var modal = document.getElementById('errorModal');
    modal.style.display = "block";

    $("#errorMessage").text(errorName + " Error: " + httpRequest.responseText);
}

function createColumns(startingColumns, groupType) {
    var newColumns = [startingColumns.length + dataColumnsCount];

    //add initial colummns
    for (var i = 0; i < startingColumns.length; i++) {
        var column = startingColumns[i];

        newColumns[i] = column;
    }

    for (i = 0; i < dataColumnsCount; i++) {
        column = createColumn(i, groupType);

        var newColumnIndex = i + startingColumns.length;
        newColumns[newColumnIndex] = column;
    }

    return newColumns;
}

function createAssignmentColumns(startingColumns, groupType) {
    var newColumns = [startingColumns.length + dataColumnsCount];

    //add initial colummns
    for (var i = 0; i < startingColumns.length; i++) {
        var column = startingColumns[i];

        newColumns[i] = column;
    }

    for (i = 0; i < dataColumnsCount; i++) {
        column = createAssignmentColumn(i, groupType);

        var newColumnIndex = i + startingColumns.length;
        newColumns[newColumnIndex] = column;
    }

    return newColumns;
}



function createColumn(fieldName, groupType) {
    return {
        suppressMenu: true,
        context: { type: groupType, index: fieldName },
        children: [
            { width: 67, context: { type: "dataColumn", index: 0 }, field: fieldName + "-ActualHours", cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true },
            { width: 67, context: { type: "dataColumn", index: 1 }, field: fieldName + "-ForecastHours", cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true }
        ]
    };
}

function createAssignmentColumn(fieldName, groupType) {
    return {
        suppressMenu: true,
        context: { type: groupType, index: fieldName },
        width: 67,
        field: fieldName + "-ResourceHours",
        cellRenderer: timePeriodCellRenderer,
        suppressSorting: true,
        suppressMenu: true,
    };
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

var loadingCellRenderer = function (params) {
    if (params.data !== undefined) {
        return params.value;
    } else {
        return '<img src="../images/loading.gif">'
    }
};

function callResourceServerAuth(params, query, resourceSuccessCallback, resourceFailureCallback) {
    var authContext = new AuthenticationContext(config);

    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (error || !token) {
            alert('ADAL Error: ' + error);
            return;
        }
        callResourceServer(params, query, resourceSuccessCallback, resourceFailureCallback, token);
    });
}

function callResourceServer(params, query, resourceSuccessCallback, resourceFailureCallback, token) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', query);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                httpResponse = JSON.parse(httpRequest.responseText);
                resourceSuccessCallback(params, query, httpResponse);
            }
            else {
                resourceFailureCallback(httpRequest);
            }
        }
    };


}

function callAssignmentServerAuth(query, resourceSuccessCallback, resourceFailureCallback) {
    var authContext = new AuthenticationContext(config);

    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (error || !token) {
            alert('ADAL Error: ' + error);
            return;
        }
        callAssignmentServer(query, resourceSuccessCallback, resourceFailureCallback, token);
    });
}

function callAssignmentServer(query, resourceSuccessCallback, resourceFailureCallback, token) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', query);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                httpResponse = JSON.parse(httpRequest.responseText);
                resourceSuccessCallback(query, httpResponse);
            }
            else {
                resourceFailureCallback(httpRequest);
            }
        }
    };
}