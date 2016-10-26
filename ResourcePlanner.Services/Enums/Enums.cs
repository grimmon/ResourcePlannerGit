using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace ResourcePlanner.Services.Enums
{
    public class Enums
    {
        public enum TimeAggregation
        {
            [Description("Daily")]
            Daily = 0,
            [Description("Weekly")]
            Weekly = 1,
            [Description("Monthly")]
            Monthly = 2,
            [Description("Daily")]
            Quarterly = 3
        }
        public enum SortOrder
        {
            [Description("FirstName")]
            FirstName,
            [Description("LastName")]
            LastName,
            [Description("City")]
            City,
            [Description("Position")]
            Position,
        }

        public enum SortDirection
        {
            Asc,
            Desc
        }
    }
    
}