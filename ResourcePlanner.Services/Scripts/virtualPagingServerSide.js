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