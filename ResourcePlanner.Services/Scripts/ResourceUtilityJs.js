var columnHeaders = {};
var selectedResource = {};
var currentColumns = [];

function formatDate(date) {
    var endMonth = (date.getMonth() + 1);
    var endDay = date.getDate();

    if (endMonth < 10)
        endMonth = "0" + endMonth;

    if (endDay < 10)
        endDay = "0" + endDay;

    return date.getFullYear() + '-' + endMonth + '-' + endDay;
}

function pageUp() {
    var aggregationDropdown = document.getElementById("aggregationsDropdown");
    var aggregation = aggregationDropdown.value;

    var endDateInput = document.getElementById("endDateInput");
    var endDateInputValue = endDateInput.value;
    var oldEndDate = new Date(endDateInputValue);
    
    var startDateInput = document.getElementById("startDateInput");
    var startDateInputValue = startDateInput.value;
    var oldStartDate = new Date(startDateInputValue);

    if (aggregation == '0') {
        var oldEndDateOffset = oldEndDate.getDate() + 2;

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;

        var oldStartDateOffset = oldStartDate.getDate() + 2;

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;
    }
    else if (aggregation == '1') {
        var oldEndDateOffset = oldEndDate.getDate() + 8;

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;

        var oldStartDateOffset = oldStartDate.getDate() + 8;

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;
    }
    else if (aggregation == '2') {
        var oldEndDateOffset = oldEndDate.getDate() + 1;

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;

        var oldStartDateOffset = oldStartDate.getDate() + 1;

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;
    }
    else if (aggregation == '3') {

    }
}

function pageDown() {
    var aggregationDropdown = document.getElementById("aggregationsDropdown");
    var aggregation = aggregationDropdown.value;

    var endDateInput = document.getElementById("endDateInput");
    var endDateInputValue = endDateInput.value;
    var oldEndDate = new Date(endDateInputValue);

    var startDateInput = document.getElementById("startDateInput");
    var startDateInputValue = startDateInput.value;
    var oldStartDate = new Date(startDateInputValue);

    if (aggregation == '0') {
        var oldEndDateOffset = oldEndDate.getDate();

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;

        var oldStartDateOffset = oldStartDate.getDate();

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;
    }
    else if (aggregation == '1') {
        var oldEndDateOffset = oldEndDate.getDate() - 6;

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;

        var oldStartDateOffset = oldStartDate.getDate() - 6;

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;
    }
    else if (aggregation == '2') {

    }
    else if (aggregation == '3') {

    }
}

function onAggregationChanged() {
    var aggregationDropdown = document.getElementById("aggregationsDropdown");
    var aggregation = aggregationDropdown.value;

    var endDateInput = document.getElementById("endDateInput");

    var startDateInput = document.getElementById("startDateInput");
    var startDateInputValue = startDateInput.value;
    var oldStartDate = new Date(startDateInputValue);

    if (aggregation == '1') {
        var oldStartDateOffset = oldStartDate.getDate() - oldStartDate.getDay();

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);
        newStartDate = formatDate(newStartDate);

        startDateInput.value = newStartDate;

        var oldEndDateOffset = oldStartDate.getDate() - 6;

        var newEndDate = new Date(oldEndDate);
        newEndDate.setDate(oldEndDateOffset);
        newEndDate = formatDate(newEndDate);

        endDateInput.value = newEndDate;
    }
    else if (aggregation == '2') {
        var oldStartDateOffset = oldStartDate.getDate() + 1;

        var newStartDate = new Date(oldStartDate);
        newStartDate.setDate(oldStartDateOffset);

        var firstOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
        var lastOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 1);

        newStartDate = formatDate(firstOfMonth);

        var newEndDate = formatDate(lastOfMonth);

        startDateInput.value = newStartDate;
        endDateInput.value = newEndDate;
    }
    else if (aggregation == '3') {

    }
}

document.addEventListener('DOMContentLoaded', function () {

    var authContext = new AuthenticationContext(config);

    authContext.acquireToken(authContext.config.clientId, function (error, token) {
        if (error || !token) {
            alert('ADAL Error: ' + error);
            return;
        }
        getDropDownData(token);
    });

    var aggregationDropdown = document.getElementById("aggregationsDropdown");
    aggregationDropdown.onchange = onAggregationChanged;



    var filterButton    = document.getElementById("filterButton");
    var pageLeftButton  = document.getElementById("pageLeftButton");
    var pageRightButton = document.getElementById("pageRightButton");
    var startDateInput  = document.getElementById("startDateInput");
    var endDateInput    = document.getElementById("endDateInput");

    var now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    var startDate = formatDate(now);

    var endDate = new Date();
    endDate.setDate(now.getDate() + 7);
    endDate = formatDate(endDate);

    startDateInput.value = startDate;
    endDateInput.value = endDate;

    pageLeftButton.onclick = pageDown;
    pageRightButton.onclick = pageUp;

    filterButton.onclick = function () {
        refreshResourceGrid();
        refreshResourceDetailGrid();
    }

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

    initializeResourceGrid();
    initializeResourceDetailGrid();
});

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

        addAssignment(row, assignment, timePeriod);
    }
}

function addAssignment(row, assignment, timePeriod) {
    var actualHoursIndex   = timePeriod + "ActualHours";
    var forecastHoursIndex = timePeriod + "ForecastHours";

    row[actualHoursIndex  ] = assignment.ActualHours;
    row[forecastHoursIndex] = assignment.ForecastHours;
}

function showError(httpRequest) {
    resourceGrid.options.api.hideOverlay();

    var modal = document.getElementById('errorModal');
    modal.style.display = "block";

    $("#errorMessage").text("Error: " + httpRequest.statusText + ", " + httpRequest.responseText);
}

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

function createColumn(timePeriod) {
    return {
        headerValueGetter: getHeader,
        //headerName: timePeriod,
        suppressMenu: true,
        children: [
            { width: 67, field: timePeriod + "ActualHours"  , cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true, headerValueGetter: getHeader },
            { width: 67, field: timePeriod + "ForecastHours", cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true, headerName: "Frcst" }
        ]
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

function getHeader(params) {
    return params.colDef.field;
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