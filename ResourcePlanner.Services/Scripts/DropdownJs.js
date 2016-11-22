function getDropdownValues(){
    var query = 'api/dropdown';

    callServerWithResponseAuth('GET', null, query, dropDownSuccessCallback, showError);
}

function dropDownSuccessCallback(params, query, httpResponse) {
    var data = processDropdownData(httpResponse);

    attachDropdownValues(data);
    onDropDownSuccess();
}

function processDropdownData(httpResponse) {
    var result = [];

    for (var i = 0; i < httpResponse.length; i++) {
        var option = document.createElement('option');
        option.text  = httpResponse[i].Name;
        option.value = httpResponse[i].Id;

        var category = httpResponse[i].Category;

        if (result[category] == undefined) {
            result[category] = [];
        }

        var categoryoptions = result[category];
        categoryoptions[categoryoptions.length] = option;
    }

    return result;
}

function attachDropdownValues(dropdownValues) {

    addDefaultOptionToDropdown("orgUnitsDropdown"              );
    addDefaultOptionToDropdown("citiesDropdown"                );
    addDefaultOptionToDropdown("regionsDropdown"               );
    addDefaultOptionToDropdown("marketsDropdown"               );
    addDefaultOptionToDropdown("practicesDropdown"             );
    addDefaultOptionToDropdown("subpracticesDropdown"          );
    addDefaultOptionToDropdown("assignmentPracticesDropdown"   );
    addDefaultOptionToDropdown("assignmentSubpracticesDropdown");
    
    addValuesToDropdown("orgUnitsDropdown"    , dropdownValues['OrgUnit'    ]);
    addValuesToDropdown("citiesDropdown"      , dropdownValues['City'       ]);
    addValuesToDropdown("regionsDropdown"     , dropdownValues['Region'     ]);
    addValuesToDropdown("marketsDropdown"     , dropdownValues['Market'     ]);
    addValuesToDropdown("practicesDropdown"   , dropdownValues['Practice'   ]);
    addValuesToDropdown("subpracticesDropdown", dropdownValues['SubPractice']);
    addValuesToDropdown("aggregationsDropdown", dropdownValues['agg']);
    addValuesToDropdown("assignmentPracticesDropdown", dropdownValues['Practice']);
    addValuesToDropdown("assignmentSubpracticesDropdown", dropdownValues['SubPractice']);
}

function addDefaultOptionToDropdown(dropdownName) {
    var dropdown = document.getElementById(dropdownName);

    var noneOption = document.createElement('option');
    noneOption.text = "None";
    noneOption.value = -1;

    dropdown.appendChild(noneOption);
}

function addValuesToDropdown(dropdownName, values) {
    var dropdown = document.getElementById(dropdownName);

    if (values != undefined)
    {
        for (var i = 0; i < values.length; i++) {
            var option = values[i];
            dropdown.appendChild(option);
        }
    }
}