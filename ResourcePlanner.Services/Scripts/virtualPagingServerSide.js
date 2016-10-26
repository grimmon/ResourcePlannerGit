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

    filterButton.onclick = function () {
        count++;
        refreshResourceGrid();
    }

    initializeResourceGrid();
    initializeResourceDetailGrid();
});