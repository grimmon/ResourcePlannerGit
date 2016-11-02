var selectedResource = {};
var startingColumns = {};
var headers = [];

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
    var pageLeftButton  = document.getElementById("pageLeftButton");
    var pageRightButton = document.getElementById("pageRightButton");
    var aggregationDropdown = document.getElementById("aggregationsDropdown");

    dateTimeUtility.currentAggregation = aggregationDropdown.value;

    var now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    dateTimeUtility.currentDate = now;

    pageLeftButton.onclick = pageDown;
    pageRightButton.onclick = pageUp;

    filterButton.onclick = function () {
        var aggregation = document.getElementById('aggregationsDropdown').value;

        dateTimeUtility.currentAggregation = aggregation;

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

function pageUp() {
    dateTimeUtility.updateCurrentDate(1);

    refreshResourceGrid();
    refreshResourceDetailGrid();
}

function pageDown() {
    dateTimeUtility.updateCurrentDate(-1);

    refreshResourceGrid();
    refreshResourceDetailGrid();
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

function addAssignment(row, assignment, timePeriod) {
    var actualHoursIndex   = timePeriod + "-ActualHours";
    var forecastHoursIndex = timePeriod + "-ForecastHours";

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
        columnCount = columns.TimePeriods.length;
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
            headers[i] = timePeriod;

            column = createColumn(i);

            var newColumnIndex = i + startingColumns.length;
            newColumns[newColumnIndex] = column;
        }
    }

    return newColumns;
}

function createColumn(fieldName) {
    return {
        headerValueGetter: getGroupName,
        suppressMenu: true,
        children: [
            { width: 67, field: fieldName + "-ActualHours", cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true, headerValueGetter: getHeader },
            { width: 67, field: fieldName + "-ForecastHours", cellRenderer: timePeriodCellRenderer, suppressSorting: true, suppressMenu: true, headerName: "Frcst" }
        ]
    };
}

function getHeader(params) {
    var splitName = params.colDef.field.split("-");
    var header = headers[splitName[0]];

    return header;
}

function getGroupName(params) {
    return "hi";
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