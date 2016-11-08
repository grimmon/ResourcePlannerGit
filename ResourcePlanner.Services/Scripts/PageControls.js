$(document).ready(function () {
    $(".project-selector").select2({
        placeholder: "Select a project",
        minimumInputLength: 3,
        ajax: {
            url: "/api/project",
            dataType: 'json',
            delay: 250,
            placeholder: "Select a project",
            minimumInputLength: 5,
            data: function (params) {
                var queryParameters = {
                    searchTerm: params.term, // search term
                };
                return queryParameters;
            },
            processResults: function (data, params) {


                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.Name,
                            id: item.Id
                        }
                    })
                };
            },
        },
    });



    $(".position-selector").select2({
        placeholder: "Select a title",
        ajax: {
            url: "/api/position",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var queryParameters = {
                    searchTerm: params.term, // search term
                };
                return queryParameters;
            },
            processResults: function (data, params) {


                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.Name,
                            id: item.Id
                        }
                    })
                };
            },
        },
    });
    $("#myTags").tagit({
        fieldName: "searchbar",
        caseSensitive: false,
        readOnly: false,
        tagLimit: 3,
        placeholderText: "Search",
        afterTagAdded: function (event, ui) { this.placeholderText = null },
        onTagLimitExceeded: function (event, ui) {
            this.readOnly = true;
        }
    });

    var daysOfWeek = [{ id: 1, text: 'Sunday' }
                ,{ id: 2, text: 'Monday' }
                ,{ id: 3, text: 'Tuesday' }
                ,{ id: 4, text: 'Wednesday' }
                ,{ id: 5, text: 'Thursday' }
                ,{ id: 6, text: 'Friday' }
                , { id: 7, text: 'Saturday' }];

    $(".dayofweek-selector").select2({
        data: daysOfWeek,
        initSelection : function (element, callback) {
            var data = [{ id: 2, text: 'Monday' }
                    ,{ id: 3, text: 'Tuesday' }
                    ,{ id: 4, text: 'Wednesday' }
                    ,{ id: 5, text: 'Thursday' }
                    ,{ id: 6, text: 'Friday' }];
           callback(data);
        }
    });

});