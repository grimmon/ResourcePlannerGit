getDropDownData = function (token) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'api/dropdown');
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                httpResponse = JSON.parse(httpRequest.responseText);

                var citiesDropdown    = document.getElementById("citiesDropdown"   );
                var orgUnitsDropdown  = document.getElementById("orgUnitsDropdown" );
                var regionsDropdown   = document.getElementById("regionsDropdown"  );
                var marketsDropdown   = document.getElementById("marketsDropdown"  );
                var practicesDropdown = document.getElementById("practicesDropdown");

                var citiesNoneOption = document.createElement('option');
                citiesNoneOption.text = 'None';
                citiesNoneOption.value = -1;

                var orgUnitsNoneOption = document.createElement('option');
                orgUnitsNoneOption.text = 'None';
                orgUnitsNoneOption.value = -1;

                var regionsNoneOption = document.createElement('option');
                regionsNoneOption.text = 'None';
                regionsNoneOption.value = -1;

                var regionsNoneOption = document.createElement('option');
                regionsNoneOption.text = 'None';
                regionsNoneOption.value = -1;

                var marketsNoneOption = document.createElement('option');
                marketsNoneOption.text = 'None';
                marketsNoneOption.value = -1;

                var practicesNoneOption = document.createElement('option');
                practicesNoneOption.text = 'None';
                practicesNoneOption.value = -1;

                citiesDropdown.appendChild(citiesNoneOption);
                orgUnitsDropdown.appendChild(orgUnitsNoneOption);
                regionsDropdown.appendChild(regionsNoneOption);
                marketsDropdown.appendChild(marketsNoneOption);
                practicesDropdown.appendChild(practicesNoneOption);

                for (var i = 0; i < httpResponse.length; i++) {
                    var option = document.createElement('option');
                    option.text = httpResponse[i].Name;
                    option.value = httpResponse[i].Id;

                    if (httpResponse[i].Category == 'OrgUnit') {
                        citiesDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'City') {
                        citiesDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Region') {
                        regionsDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Market') {
                        marketsDropdown.appendChild(option);
                    }
                    if (httpResponse[i].Category == 'Practice') {
                        practicesDropdown.appendChild(option);
                    }
                }
            }
            else {
            }
        }
    }
}
