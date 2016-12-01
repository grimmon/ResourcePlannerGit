var resourceGrid = {
    name: '#myGrid',
    options: {
        debug: true,
        enableServerSideSorting: true,
        enableServerSideFilter: true,
        enableColResize: true,
        rowSelection: 'single',
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
        },
    },
    currentDate: new Date(),
    currentAggregation: {},
    pageSize: 8,
};

var startingResourceColumnDefs = [
    { context: { type: "resourceColumn", index: 0 }, headerName: "Resource"    , field: "ResourceName", width: 150, suppressMenu: true, pinned: 'left', cellRenderer: loadingCellRenderer },
    { context: { type: "resourceColumn", index: 1 }, headerName: "Position"    , field: "Position"    , width: 150, suppressMenu: true, pinned: 'left' },
    { context: { type: "resourceColumn", index: 2 }, headerName: "City"        , field: "City"        , width: 150, suppressMenu: true, pinned: 'left' },
    { context: { type: "resourceColumn", index: 3 }, headerName: "Practice"    , field: "Practice"    , width: 150, suppressMenu: true, pinned: 'left' },
    { context: { type: "resourceColumn", index: 4 }, headerName: "Sub-Practice", field: "SubPractice", width: 150, suppressMenu: true, pinned: 'left' },
    { context: { type: "resourceColumn", index: 5 }, headerName: "Resource Mgr.", field: "ResourceManager", width: 150, suppressMenu: true, pinned: 'left' },
];

function initializeResourceGrid() {
    var gridDiv = document.querySelector(resourceGrid.name);
    new agGrid.Grid(gridDiv, resourceGrid.options);

    var startingResourceColumns = createColumns(startingResourceColumnDefs, "resourceGroupColumn");
    resourceGrid.options.api.setColumnDefs(startingResourceColumns);
    $("#exportExcel").click(exportResourceToExcel);
    refreshResourceGrid();
}

function refreshResourceGrid() {
    resourceGrid.options.api.showLoadingOverlay();

    var dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function getResourceData(params) {
            var query = buildResourceQuery(params);
            callServerWithResponseAuth('GET', params, query, onCallResourceSuccess, showError);
        }
    };

    resourceGrid.options.api.setDatasource(dataSource);
}

function buildResourceQuery(params, excel) {
   

    var filters = '?';
    if (excel) { }
    else {
        var pageSize = (params.endRow - params.startRow);
        var pageNum = params.startRow / pageSize;

        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        var pageSizeParam = 'pageSize=' + pageSize;
        var pageNumParam = '&pageNum=' + pageNum;

        filters += pageSizeParam + pageNumParam;
    }
    var city            = document.getElementById('citiesDropdown'         ).value;
    var orgUnit         = document.getElementById('orgUnitsDropdown'       ).value;
    var region          = document.getElementById('regionsDropdown'        ).value;
    var market          = document.getElementById('marketsDropdown'        ).value;
    var practice        = document.getElementById('practicesDropdown'      ).value;
    var subPractice     = document.getElementById('subpracticesDropdown'   ).value;
    var aggregation     = document.getElementById('aggregationsDropdown'   ).value;
    var resourceManager = document.getElementById('resourceManagerDropdown').value;

    var searchTerm1 = $("#myTags").tagit("assignedTags")[0];
    var searchTerm2 = $("#myTags").tagit("assignedTags")[1];
    var searchTerm3 = $("#myTags").tagit("assignedTags")[2];

    var startDate = dateTimeUtility.getStartDate(resourceGrid.currentDate, resourceGrid.currentAggregation, resourceGrid.pageSize);
    var endDate = dateTimeUtility.getEndDate(resourceGrid.currentDate, resourceGrid.currentAggregation, resourceGrid.pageSize);

    var formattedStartDate = dateTimeUtility.formatDate(startDate);
    var formattedEndDate = dateTimeUtility.formatDate(endDate);

    filters += "&startDate=" + formattedStartDate;
    filters += "&endDate=" + formattedEndDate;

    if (city            > -1    && city            != '') { filters += "&city="            + city;           }
    if (orgUnit         > -1    && orgUnit         != '') { filters += "&orgUnit="         + orgUnit;        }
    if (region          > -1    && region          != '') { filters += "&region="          + region;         }
    if (market          > -1    && market          != '') { filters += "&market="          + market;         }
    if (practice        > -1    && practice        != '') { filters += "&practice="        + practice;       }
    if (subPractice     > -1    && subPractice     != '') { filters += "&subpractice="     + subPractice;    }
    if (aggregation     > -1    && aggregation     != '') { filters += "&agg="             + aggregation;    }
    if (resourceManager > -1    && resourceManager != '') { filters += "&resourcemanager=" + resourceManager;}
    if (searchTerm1     != null && searchTerm1     != '') { filters += "&searchterm1="     + searchTerm1;    }
    if (searchTerm2     != null && searchTerm2     != '') { filters += "&searchterm2="     + searchTerm2;    }
    if (searchTerm3     != null && searchTerm3     != '') { filters += "&searchterm3="     + searchTerm3;    }
    if (!excel){
    if (params.sortModel.length > 0) {
        filters += '&sortOrder='     + params.sortModel[0].colId;
        filters += "&sortDirection=" + params.sortModel[0].sort;
    }}
    var query = '';
    if (excel) {
        query = 'api/resource/excelexport' + filters;
    }
    else {
        query = 'api/resource' + filters;
    }
    return query;
}

function onCallResourceSuccess(params, query, httpResponse) {
    var rows = createRows(httpResponse.Resources, httpResponse.TimePeriods, createResourceRow);

    for (var i = 0; i < httpResponse.TimePeriods.length; i++) {
        var timePeriod = httpResponse.TimePeriods[i];
        resourceGroupHeaders[i] = "";
        if (i == 0){
            resourceGroupHeaders[i] += '<a id="pageLeftButton" style="float: left;"><img src="/Images/IRMT_Icons_BackAWeek.png" alt="Add project" /></a>'
                                
                            ;
            //'<a id="pageLeftButton"><div><img src="../Images/filters.svg.png" alt="Filters"></div></a>'
        }
        resourceGroupHeaders[i] +=  timePeriod; 
        if (i == 7) {
            resourceGroupHeaders[i] += '<a id="pageRightButton" style="float: right;"><img src="/Images/IRMT_Icons_ForwardAWeek.png" alt="Add project" /></a>';
        }
    }

    params.successCallback(rows, httpResponse.TotalRowCount);
    resourceGrid.options.api.hideOverlay();
    resourceGrid.options.api.refreshHeader();
    var pageLeftButton = document.getElementById("pageLeftButton");
    var pageRightButton = document.getElementById("pageRightButton");
    pageLeftButton.onclick = pageDown;
    pageRightButton.onclick = pageUp;
}

function createResourceRow(row, resource, timePeriods) {
    addResourceData(row, resource            );
    addTimePeriods (row, timePeriods         );
    addAssignments (row, resource.Assignments);
}

function addResourceData(row, resource) {
    row.ResourceName = "<b>" + (resource.LastName + ", " || "" ) + resource.FirstName + "</b>";
    row.City           = resource.City;
    row.Position       = resource.Position;
    row.Practice       = resource.Practice;
    row.SubPractice    = resource.SubPractice;
    row.ResourceManager = (resource.ResourceManagerLastName + ", " || "") + resource.ResourceManagerFirstName;
    row.Id             = resource.ResourceId;
}

function rowSelectedFunc(event) {
    if (event.node.isSelected()) {
        selectedResource.Id = event.node.data.Id;
        refreshResourceDetailGridEvent(event);
    }
}

function updateResourceAggregation(aggregation) {
    resourceGrid.currentAggregation = aggregation;
}

function exportResourceToExcel() {
    query = buildResourceQuery(null, true);
    var iframe = $('<iframe frameborder="0" scrolling="no" id="myFrame"></iframe>');
    iframe.attr('src', query);
    iframe.appendTo('body');
}