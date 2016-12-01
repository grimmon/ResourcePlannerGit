var dateTimeUtility = {

    updateCurrentDate: function (currentDate, currentAggregation, pageSize, periodOffset) {
        var newDate = this.moveDate(currentDate, currentAggregation, periodOffset * pageSize);
        return newDate;
    },


    getStartDate: function (currentDate, currentAggregation, pageSize) {
        var periodOffset = -1; //we want to start with the previous period.
        var date = this.moveDate(currentDate, currentAggregation, periodOffset);

        return date;
    },

    getEndDate: function(currentDate, currentAggregation, pageSize) {
        var periodOffset = pageSize - 2; //The number of periods into the future we want.
        var date = this.moveDate(currentDate, currentAggregation, periodOffset);

        return date;
    },

    moveDate: function (currentDate, currentAggregation, periodOffset) {
        var startDate = {};

        if (currentAggregation == '0') {
            //Daily
            startDate = this.getDate(currentDate, periodOffset);
        }
        else if (currentAggregation == '1') {
            //Weekly
            startDate = this.getWeek(currentDate, periodOffset);
        }
        else if (currentAggregation == '2') {
            //Monthly
            startDate = this.getMonth(currentDate, periodOffset);
        }
        else if (currentAggregation == '3') {
            //Quarterly
            startDate = this.getQuarter(currentDate, periodOffset);
        }

        return startDate;
    },

    getDate: function (date, periodOffset) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();

        var result = new Date(year, month, day + periodOffset, 0, 0, 0, 0);

        return result;
    },

    getWeek: function (date, periodOffset) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();

        var currentDay = date.getDay();
        var dayOfWeekOffset = -1 * currentDay;
        var weekOffset = periodOffset * 7;

        var startOfWeek = new Date(year, month, day + dayOfWeekOffset + weekOffset, 0, 0, 0, 0);

        return startOfWeek;
    },

    getMonth: function (date, periodOffset) {
        var year = date.getFullYear();
        var month = date.getMonth();
        
        var startOfMonth = new Date(year, month + periodOffset, 1, 0, 0, 0, 0);

        return startOfMonth;
    },

    getQuarter: function (date, periodOffset) {
        var year = date.getFullYear();
        var month = date.getMonth();

        var startMonth = Math.floor(month / 3) * 3;

        var startOfQuarter = new Date(year, startMonth + periodOffset*3, 1, 0, 0, 0, 0);

        return startOfQuarter;
    },

    formatDate: function (date) {
        var endMonth = (date.getMonth() + 1);
        var endDay = date.getDate();

        if (endMonth < 10)
            endMonth = "0" + endMonth;

        if (endDay < 10)
            endDay = "0" + endDay;

        return date.getFullYear() + '-' + endMonth + '-' + endDay;
    }
}

