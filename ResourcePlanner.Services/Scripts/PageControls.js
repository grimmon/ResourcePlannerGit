$(".project-selector").select2({
    ajax: {
        url: "/api/projects",
        dataType: 'json',
        delay: 250,
        minimumInputLength: 5,
        data: function (params) {
            var queryParameters = {
                term: params.term, // search term
            };
            return queryParameters;
        },
        processResults: function (data, params) {
           

            return {
                results: $.map(data, function(item){
                    return {
                        text: item.ProjectName,
                        id: item.ProjectId
                    }
                })
            };
        },
    },
});