var listOfCountries = ['United States','Russia','Australia','Canada','Norway','China','Zimbabwe','Netherlands','South Korea','Croatia',
    'France','Japan','Hungary','Germany','Poland','South Africa','Sweden','Ukraine','Italy','Czech Republic','Austria','Finland','Romania',
    'Great Britain','Jamaica','Singapore','Belarus','Chile','Spain','Tunisia','Brazil','Slovakia','Costa Rica','Bulgaria','Switzerland',
    'New Zealand','Estonia','Kenya','Ethiopia','Trinidad and Tobago','Turkey','Morocco','Bahamas','Slovenia','Armenia','Azerbaijan','India',
    'Puerto Rico','Egypt','Kazakhstan','Iran','Georgia','Lithuania','Cuba','Colombia','Mongolia','Uzbekistan','North Korea','Tajikistan',
    'Kyrgyzstan','Greece','Macedonia','Moldova','Chinese Taipei','Indonesia','Thailand','Vietnam','Latvia','Venezuela','Mexico','Nigeria',
    'Qatar','Serbia','Serbia and Montenegro','Hong Kong','Denmark','Portugal','Argentina','Afghanistan','Gabon','Dominican Republic','Belgium',
    'Kuwait','United Arab Emirates','Cyprus','Israel','Algeria','Montenegro','Iceland','Paraguay','Cameroon','Saudi Arabia','Ireland','Malaysia',
    'Uruguay','Togo','Mauritius','Syria','Botswana','Guatemala','Bahrain','Grenada','Uganda','Sudan','Ecuador','Panama','Eritrea','Sri Lanka',
    'Mozambique','Barbados'];

var columnDefs = [
    {
        headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true,
        cellRenderer: function (params) {
            if (params.data !== undefined) {
                return params.node.id;
            } else {
                return '<img src="../images/loading.gif">'
            }
        },
    },
    {headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: {newRowsAction: 'keep'}},
    {headerName: "Position", field: "Position", width: 150, filter: 'set', filterParams: { values: listOfCountries, newRowsAction: 'keep' } },
    {headerName: "City", field: "City", width: 150, suppressMenu: true},
];

var gridOptions = {
    debug: true,
    enableServerSideSorting: true,
    enableServerSideFilter: true,
    enableColResize: true,
    rowSelection: 'single',
    rowDeselection: true,
    columnDefs: columnDefs,
    rowModelType: 'virtual',
    paginationPageSize: 50,
    paginationOverflowSize: 2,
    maxConcurrentDatasourceRequests: 2,
    paginationInitialRowCount: 1,
    maxPagesInCache: 2,
    getRowNodeId: function(item) {
        return item.id;
    }
};

function setRowData() {
    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            // At this point in your code, you would call the server, using $http if in AngularJS.

            // To make the demo look real, wait for 500ms before returning
            setTimeout(function () {

                var filters = '?';

                var startRowParam = 'pageSize=' + (params.endRow - params.startRow);
                var endRowParam = 'pageNum=' + params.startRow / (params.endRow - params.startRow);
                var sortOrder = 'sort=' + params.sortModel.colId;

                filters += startRowParam + '&' + endRowParam;

                var query = 'http://localhost:1620/api/resource' + filters;

                var httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', query);
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        var httpResponse = JSON.parse(httpRequest.responseText);
                        
                        // take a slice of the total rows
                        var dataAfterSortingAndFiltering = httpResponse.Resources; //sortAndFilter(allOfTheData.Resources, params.sortModel, params.filterModel);

                        // give each row an id
                        httpResponse.Resources.forEach(function (data, index) {
                            data.id = 'R' + (index + 1);
                        });

                        var rowsThisPage = dataAfterSortingAndFiltering.slice(params.startRow, params.endRow);
                        // if on or after the last page, work out the last row.
                        var lastRow = -1;
                        if (dataAfterSortingAndFiltering.length <= params.endRow) {
                            lastRow = dataAfterSortingAndFiltering.length;
                        }

                        var newColumns = [ {
                            headerName: "First Name", field: "FirstName", width: 150, suppressMenu: true,
                            cellRenderer: function (params) {
                                    if (params.data !== undefined) {
                                        return params.value;
                                    } else {
                                        return '<img src="../images/loading.gif">'
                                    }
                                },
                            },
                            { headerName: "Last Name", field: "LastName", width: 150, filter: 'number', filterParams: { newRowsAction: 'keep' } },
                            { headerName: "Position", field: "Position", width: 150, filter: 'set', filterParams: { values: listOfCountries, newRowsAction: 'keep' } },
                            { headerName: "City", field: "City", width: 150, suppressMenu: true },
                        ]

                        for (var j = 0; j < httpResponse.TimePeriods.length; j++) {
                            var timePeriod = httpResponse.TimePeriods[j];
                            newColumns[j + 4] = {
                                headerName: timePeriod, field: timePeriod, width: 150, suppressMenu: true
                            }
                        }

                        var flattenedRows = [rowsThisPage.length];

                        for (var i = 0; i < rowsThisPage.length; i++) {
                            var row = {};
                            var currentObject = rowsThisPage[i];

                            row.FirstName = currentObject.FirstName;
                            row.LastName = currentObject.LastName;
                            row.City = currentObject.City;
                            row.Position = currentObject.Position;

                            for (var j = 0; j < httpResponse.TimePeriods.length; j++) {
                                row[httpResponse.TimePeriods[j]] = '';
                            }

                            for (var j = 0; j < currentObject.Assignments.length; j++) {
                                var timePeriod = currentObject.Assignments[j].TimePeriod;

                                row[timePeriod] = currentObject.Assignments[j].ActualHours;
                            }

                            flattenedRows[i] = row;
                        }

                        gridOptions.api.setColumnDefs(newColumns);

                        // call the success callback
                        params.successCallback(flattenedRows, lastRow);
                    }
                };
            }, 500);
        }
    };

    gridOptions.api.setDatasource(dataSource);
}

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');

    new agGrid.Grid(gridDiv, gridOptions);

    setRowData();
});