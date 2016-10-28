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
            [Description("Quarterly")]
            Quarterly = 3
        }
        public enum SortOrder
        {
            [Description("None")]
            None,
            [Description("FirstName")]
            FirstName,
            [Description("LastName")]
            LastName,
            [Description("City")]
            City,
            [Description("Position")]
            Position,
            [Description("Practice")]
            Practice,
            [Description("SubPractice")]
            SubPractice,
        }

        public enum SortDirection
        {
            Asc,
            Desc
        }
    }
    
}