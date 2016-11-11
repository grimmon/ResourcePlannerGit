/// <reference path="C:\Repos\ResourcePlannerGit2\ResourcePlannerGit\ResourcePlanner.Services\systemjs.config.extras.js" />
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

    var daysOfWeek = [{ id: 2, text: 'Monday', short: "Mon" }
                ,{ id: 3, text: 'Tuesday', short: "Tue" }
                ,{ id: 4, text: 'Wednesday', short: "Wed" }
                , { id: 5, text: 'Thursday', short: "Thu" }
                , { id: 6, text: 'Friday', short: "Fri" }
                , { id: 7, text: 'Saturday', short: "Sat" }
                ,{ id: 1, text: 'Sunday', short: "Sun" }];

    $(".dayofweek-selector").select2({
        data: daysOfWeek
    });

   
    $('#startdatepicker').datetimepicker({
        format: "MM/DD/YYYY"
    });
    $('#enddatepicker').datetimepicker({
        format: "MM/DD/YYYY",
        useCurrent: false //Important! See issue #1075
    });
    $("#startdatepicker").on("dp.change", function (e) {
        $('#enddatepicker').data("DateTimePicker").minDate(e.date);
    });
    $("#enddatepicker").on("dp.change", function (e) {
        $('#startdatepicker').data("DateTimePicker").maxDate(e.date);
    });



});